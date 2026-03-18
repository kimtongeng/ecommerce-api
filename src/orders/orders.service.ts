import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { Address, AddressDocument } from 'src/addresses/schemas/address.schema';

@Injectable()
export class OrdersService {
  constructor(
  @InjectModel(Order.name)
  private orderModel: Model<OrderDocument>,

  @InjectModel(Address.name)
  private addressModel: Model<AddressDocument>,

  private cartService: CartService,
) {}

  async createOrder(userId: string, addressId: string) {
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    await cart.populate('items.productId');

    const address = await this.addressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    let subtotal = 0;

    const items = cart.items.map((item: any) => {
      const price = item.productId.price;
      subtotal += price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price,
      };
    });

    const shippingFee = 10;
    const total = subtotal + shippingFee;

    const order = await this.orderModel.create({
      userId,
      items,
      subtotal,
      shippingFee,
      total,
      address: {
        fullName: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        province: address.country,
        postalCode: address.zipCode,
      },
      status: 'pending',
    });

    await this.cartService.clearCart(userId);

    return order;
  }

  async getMyOrders(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
  }

  async getOrder(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('items.productId');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
