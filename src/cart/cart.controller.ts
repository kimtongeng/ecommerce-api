import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  addToCart(@Body() body: any) {
    return this.cartService.addToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Put('update')
  update(@Body() body: any) {
    return this.cartService.updateQuantity(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete('remove/:userId/:productId')
  removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete('clear/:userId')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
