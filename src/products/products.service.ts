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

  async getFlashSaleProducts() {
    return this.productModel
      .find({ discountPrice: { $exists: true, $ne: null } })
      .limit(5);
  }

  async getRecommendedProducts() {
    return this.productModel
      .find()
      .sort({ rating: -1 })
      .limit(6);
  }

  async search(query: any) {
    const { keyword, brand, size, color, sort, page = 1, limit = 10 } = query;

    const filter: any = {};

    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }

    if (brand) {
      filter.brand = brand;
    }

    if (color) {
      filter.color = color;
    }

    if (size) {
      filter.size = size;
    }

    let sortOption = {};

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    }

    if (sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    const skip = (page - 1) * limit;

    const products = await this.productModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await this.productModel.countDocuments(filter);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      results: products,
    };
  }
}