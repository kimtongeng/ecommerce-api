import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategyService } from './auth/jwt-strategy/jwt-strategy.service';
import { ProductsModule } from './products/products.module';
import { HomeModule } from './home/home.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentsModule } from './payments/payments.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WishlistModule } from './wishlist/wishlist.module';
import { PaypalService } from './paypal/paypal.service';
import { PaypalModule } from './paypal/paypal.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerce'),

    // ⭐ STATIC IMAGE FOLDER CONFIG
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
    ProductsModule,
    HomeModule,
    CartModule,
    OrdersModule,
    AddressesModule,
    PaymentsModule,
    CategoriesModule,
    ReviewsModule,
    WishlistModule,
    PaypalModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategyService],
})
export class AppModule {}