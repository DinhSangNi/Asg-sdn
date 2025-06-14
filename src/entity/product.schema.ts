import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  price: number;

  @Prop()
  image: string[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
