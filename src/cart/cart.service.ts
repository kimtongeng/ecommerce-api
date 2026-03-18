import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId');

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: [],
      });
    }

    return cart;
  }

  async addToCart(userId: string, productId: string, quantity = 1) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: [],
      });
    }

    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId),
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();

    return this.cartModel.findById(cart._id).populate('items.productId');
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) throw new NotFoundException('Item not found');

    item.quantity = quantity;

    await cart.save();

    return cart;
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    return cart;
  }

  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = [];

    await cart.save();

    return cart;
  }
}
