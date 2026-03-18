import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import {
  ProductVariant,
  ProductVariantDocument,
} from './schemas/product-variant.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Wishlist,
  WishlistDocument,
} from '../wishlist/schemas/wishlist.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,

    @InjectModel(ProductVariant.name)
    private variantModel: Model<ProductVariantDocument>,

    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
  ) {}

  async create(data: Partial<Product>) {
    return this.productModel.create(data);
  }

  async createVariant(productId: string, data: any) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const variant = await this.variantModel.create({
      ...data,
      productId: new Types.ObjectId(productId),
    });

    await this.productModel.findByIdAndUpdate(productId, {
      $push: { variants: variant._id },
    });

    return variant;
  }

  // ⭐ helper — fixed: query by string instead of ObjectId
  private async getWishlistProductIds(userId: string) {
    const wishlist = await this.wishlistModel
      .find()
      .lean();

    return wishlist
      .filter((w) => String(w.user) === userId)
      .map((w) => String(w.product));
  }

  async findAll(userId?: string) {
    const products = await this.productModel.find().lean();

    if (!userId) return products;

    const wishlistIds = await this.getWishlistProductIds(userId);

    return products.map((p) => ({
      ...p,
      isWishlist: wishlistIds.includes(String(p._id)),
    }));
  }

  // ⭐ PRODUCT DETAIL — fixed: use string comparison instead of ObjectId
  async findById(id: string, userId?: string) {
    const product = await this.productModel
      .findById(id)
      .populate('variants')
      .lean();

    if (!product) throw new NotFoundException('Product not found');

    if (!userId) return product;

    const exists = await this.wishlistModel.findOne({
      $expr: {
        $and: [
          { $eq: [{ $toString: '$user' }, userId] },
          { $eq: [{ $toString: '$product' }, id] },
        ],
      },
    }).lean();

    return {
      ...product,
      isWishlist: !!exists,
    };
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

    await this.variantModel.deleteMany({ productId: id });

    return { message: 'Product deleted successfully' };
  }

  async getFlashSaleProducts(userId?: string) {
    const products = await this.productModel
      .find({ discountPrice: { $exists: true, $ne: null } })
      .limit(5)
      .lean();

    if (!userId) return products;

    const wishlistIds = await this.getWishlistProductIds(userId);

    return products.map((p) => ({
      ...p,
      isWishlist: wishlistIds.includes(String(p._id)),
    }));
  }

  async getRecommendedProducts(userId?: string) {
    const products = await this.productModel
      .find()
      .sort({ rating: -1 })
      .limit(6)
      .lean();

    if (!userId) return products;

    const wishlistIds = await this.getWishlistProductIds(userId);

    return products.map((p) => ({
      ...p,
      isWishlist: wishlistIds.includes(String(p._id)),
    }));
  }

  async search(query: any, userId?: string) {
    const { keyword, brand, sort, page = 1, limit = 10 } = query;

    const filter: any = {};
    if (keyword) filter.title = { $regex: keyword, $options: 'i' };
    if (brand) filter.brand = brand;

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const skip = (page - 1) * limit;

    const products = await this.productModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await this.productModel.countDocuments(filter);

    if (!userId) {
      return {
        total,
        page: Number(page),
        limit: Number(limit),
        results: products,
      };
    }

    const wishlistIds = await this.getWishlistProductIds(userId);

    const results = products.map((p) => ({
      ...p,
      isWishlist: wishlistIds.includes(String(p._id)),
    }));

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      results,
    };
  }
}