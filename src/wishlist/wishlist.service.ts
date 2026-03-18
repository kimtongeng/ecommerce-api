import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { Model } from 'mongoose';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
  ) {}

  async add(userId: string, productId: string): Promise<any> {
    return this.wishlistModel.create({
      user: userId,
      product: productId,
    });
  }

  async remove(userId: string, productId: string): Promise<any> {
    return this.wishlistModel.deleteOne({
      user: userId,
      product: productId,
    });
  }

  async getUserWishlist(userId: string): Promise<any> {
    return this.wishlistModel.find({ user: userId }).populate('product');
  }
}