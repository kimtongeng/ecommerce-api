import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class HomeService {
  constructor(private readonly productsService: ProductsService) {}

  async getHomeData() {
    const flashSale = await this.productsService.getFlashSaleProducts();
    const recommended = await this.productsService.getRecommendedProducts();

    return {
      banner: {
        title: 'Summer Collection',
        buttonText: 'Shop Now',
      },
      categories: ['Clothing', 'Shoes', 'Accessories', 'Home'],
      flashSale,
      recommended,
    };
  }
}
