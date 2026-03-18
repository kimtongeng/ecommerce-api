import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ _id: false })
class ShippingAddress {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop()
  postalCode?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shippingFee: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending' })
  status: string;

  // ✅ ADDRESS SNAPSHOT
  @Prop({ type: ShippingAddress, required: true })
  address: ShippingAddress;

  // ✅ PAYMENT
  @Prop()
  paymentId?: string;

  @Prop()
  paidAt?: Date;

  @Prop({ default: 'paypal' })
  paymentProvider?: string;

  @Prop({ default: 'unpaid' })
  paymentStatus?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);