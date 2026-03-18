import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  add(@Body() body: any): Promise<any> {
    return this.wishlistService.add(body.userId, body.productId);
  }

  @Delete(':userId/:productId')
  remove(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<any> {
    return this.wishlistService.remove(userId, productId);
  }

  @Get(':userId')
  get(@Param('userId') userId: string): Promise<any> {
    return this.wishlistService.getUserWishlist(userId);
  }
}