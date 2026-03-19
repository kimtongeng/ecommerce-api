import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getHomeData() {
    const [flashSale, recommended, categories] = await Promise.all([
      this.productsService.getFlashSaleProducts(),
      this.productsService.getRecommendedProducts(),
      this.categoriesService.findAll(),
    ]);

    return {
      banner: {
        title: 'Summer Collection',
        image:"Image.png",
        buttonText: 'Shop Now',
      },
      categories,
      flashSale,
      recommended,
    };
  }
}