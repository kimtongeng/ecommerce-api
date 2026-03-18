import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  getHomePage() {
    return this.homeService.getHomeData();
  }
}
