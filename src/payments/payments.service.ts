import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    private ordersService: OrdersService,
  ) {}

  async createPayment(orderId: string, userId: string, amount: number) {
    const payment = await this.paymentModel.create({
      orderId,
      userId,
      amount,
      status: 'paid',
      method: 'cash',
      transactionId: `TX-${Date.now()}`,
    });

    await this.ordersService.updateOrderStatus(orderId, 'paid');

    return payment;
  }

  async getPaymentByOrder(orderId: string) {
    return this.paymentModel.findOne({ orderId });
  }
}
