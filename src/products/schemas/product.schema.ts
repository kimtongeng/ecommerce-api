import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProductVariant' }] })
  variants: Types.ObjectId[];
}
export const ProductSchema = SchemaFactory.createForClass(Product);
