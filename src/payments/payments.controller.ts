import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() body: any) {
    return this.paymentsService.createPayment(
      body.orderId,
      body.userId,
      body.amount,
    );
  }

  @Get(':orderId')
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrder(orderId);
  }
}
