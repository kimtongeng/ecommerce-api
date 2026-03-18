import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as paypal from '@paypal/checkout-server-sdk';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class PaypalService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  private client = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET,
    ),
  );

  // ✅ 10.0.2.2 = localhost from inside Android emulator
  private readonly BASE_URL = 'http://10.0.2.2:3000';

  async createOrder(body: any) {
    const { order_id, currency = 'USD', description = 'Order Payment' } = body;

    const order = await this.orderModel.findById(order_id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'paid') {
      throw new BadRequestException('Order already paid');
    }

    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order._id.toString(),
          description: description,
          amount: {
            currency_code: currency,
            value: order.total.toFixed(2),
          },
        },
      ],
      application_context: {
        // ✅ Use http URLs so WebView intercepts them via onNavigationRequest
        return_url: `${this.BASE_URL}/paypal/success`,
        cancel_url: `${this.BASE_URL}/paypal/cancel`,
        user_action: 'PAY_NOW',
        brand_name: 'My Shop',
        shipping_preference: 'NO_SHIPPING',
      },
    });

    const response = await this.client.execute(request);

    const approveLink = response.result.links.find(
      (l) => l.rel === 'approve',
    )?.href;

    if (!approveLink) {
      throw new BadRequestException('No approval URL returned from PayPal');
    }

    return {
      paypalOrderId: response.result.id,
      approveUrl: approveLink,
    };
  }

  async captureOrder(paypalOrderId: string) {
    if (!paypalOrderId) {
      throw new BadRequestException('paypalOrderId is required');
    }

    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    let response: any;
    try {
      response = await this.client.execute(request);
    } catch (e) {
      // Already captured — return existing order
      const alreadyCaptured =
        e?.message?.includes('ORDER_ALREADY_CAPTURED') ||
        e?.statusCode === 422;

      if (alreadyCaptured) {
        const existing = await this.orderModel.findOne({
          paymentId: paypalOrderId,
        });
        if (existing) {
          return { message: 'Order already captured', order: existing };
        }
      }
      throw new BadRequestException(`PayPal capture failed: ${e.message}`);
    }

    const captureStatus = response.result.status;

    if (captureStatus !== 'COMPLETED') {
      throw new BadRequestException(
        `PayPal capture not completed. Status: ${captureStatus}`,
      );
    }

    const purchaseUnit = response.result.purchase_units?.[0];
    const referenceId = purchaseUnit?.reference_id;

    if (!referenceId) {
      throw new BadRequestException('Missing order reference from PayPal');
    }

    const order = await this.orderModel.findById(referenceId);

    if (!order) {
      throw new NotFoundException(
        `Order not found for reference: ${referenceId}`,
      );
    }

    // ✅ Idempotent — safe to call multiple times
    if (order.status === 'paid') {
      return { message: 'Order already paid', order };
    }

    order.status = 'paid';
    order.paymentStatus = "paid";
    order.paymentId = paypalOrderId;
    order.paidAt = new Date();

    await order.save();

    console.log(
      `✅ Order ${order._id} marked as paid via PayPal ${paypalOrderId}`,
    );

    return {
      message: 'Payment captured successfully',
      order,
    };
  }
}