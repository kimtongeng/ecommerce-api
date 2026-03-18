import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Post()
  create(@Body() body: any) {
    return this.addressesService.create(body);
  }

  @Get(':userId')
  getUserAddresses(@Param('userId') userId: string) {
    return this.addressesService.findByUser(userId);
  }

  @Put(':id')
  updateAddress(@Param('id') id: string, @Body() body: any) {
    return this.addressesService.update(id, body);
  }

  @Delete(':id')
  deleteAddress(@Param('id') id: string) {
    return this.addressesService.delete(id);
  }
}
