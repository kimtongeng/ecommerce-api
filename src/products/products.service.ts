import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}
  async create(data: Partial<Product>) {
    return this.productModel.create(data);
  }
  async findAll() {
    return this.productModel.find();
  }
  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
  async update(id: string, data: Partial<Product>) {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }
}
