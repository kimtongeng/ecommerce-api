import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(data: any) {
    return this.reviewModel.create(data);
  }

  async findByProduct(productId: string) {
    return this.reviewModel
      .find({ productId })
      .populate('userId', 'fullName');
  }

  async delete(id: string) {
    const review = await this.reviewModel.findByIdAndDelete(id);

    if (!review) throw new NotFoundException('Review not found');

    return { message: 'Review deleted successfully' };
  }
}