import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {

  constructor(private reviewsService: ReviewsService) {}

  @Post()
  create(@Body() body: any) {
    return this.reviewsService.create(body);
  }

  @Get('product/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}