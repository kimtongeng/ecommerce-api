import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  // ⭐ PRODUCT LIST WITH WISHLIST
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.productsService.findAll(userId);
  }

  // ⭐ SEARCH WITH WISHLIST
  @Get('search')
  search(@Query() query: any, @Query('userId') userId?: string) {
    return this.productsService.search(query, userId);
  }

  // ⭐ VARIANT
  @Post(':id/variant')
  createVariant(@Param('id') id: string, @Body() body: any) {
    return this.productsService.createVariant(id, body);
  }

  // ⭐ PRODUCT DETAIL WITH WISHLIST
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.productsService.findById(id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}