import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { HomeController } from './home.controller';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule, // ⭐ MUST IMPORT
  ],
  controllers: [HomeController], // ⭐ MUST ADD
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}