import { Body, Controller, Post ,Get, Query } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create')
  create(@Body() body: any) {
    return this.paypalService.createOrder(body);
  }

  @Post('capture')
  capture(@Body('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }

  @Get('success')
  async success(
    @Query('token') token: string,
    @Query('PayerID') payerId: string,
  ) {
    return this.paypalService.captureOrder(token);
  }

  @Get('cancel')
  cancel() {
    return { message: 'Payment cancelled' };
  }
}
