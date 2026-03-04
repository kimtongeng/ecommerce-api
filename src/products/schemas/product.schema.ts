import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;
  @Prop()
  discountPrice: number;
  @Prop()
  discountValue: number;
  @Prop()
  discountType: number;

  @Prop([String])
  image: string[];
  @Prop()
  category: string;
  @Prop()
  brand: string;
  @Prop({ default: 0 })
  stock: number;
  @Prop({ default: 0 })
  rating: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
