import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductVariantDocument = ProductVariant & Document;

@Schema({ timestamps: true })
export class ProductVariant {

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  sku: string;

  @Prop()
  size: string;

  @Prop()
  color: string;

  @Prop()
  price: number;

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  stock: number;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);