import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: any) {
    return this.categoryModel.create(data);
  }

  async findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(id: string, data: any) {
    const category = await this.categoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async delete(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);

    if (!category) throw new NotFoundException('Category not found');

    return { message: 'Category deleted successfully' };
  }
}
