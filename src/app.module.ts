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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerce'),
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
    ProductsModule,
    HomeModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategyService],
})
export class AppModule {}
