import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body('userId') userId: string,
    @Body('addressId') addressId: string,
  ) {
    return this.ordersService.createOrder(userId, addressId);
  }

  @Get('my/:userId')
  getMyOrders(@Param('userId') userId: string) {
    return this.ordersService.getMyOrders(userId);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
