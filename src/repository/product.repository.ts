import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/entity/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    filtersParams?: Record<string, any>,
  ): Promise<ProductDocument[]> {
    let filters: Record<string, any> = {
      deletedAt: null,
      ...filtersParams,
    };

    return await this.productModel
      .find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id);
  }

  async findByIdAndUpdate(
    id: string,
    product: Partial<Product>,
  ): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, product);
  }

  async create(product: Partial<Product>) {
    const newProduct = new this.productModel(product);
    return await newProduct.save();
  }

  async update(id: string, product: Partial<Product>) {
    return await this.productModel.findByIdAndUpdate(id, product);
  }

  async delete(id: string) {
    return this.productModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }

  async count(filtersParams?: Record<string, any>): Promise<number> {
    return await this.productModel.countDocuments({
      deletedAt: null,
      ...filtersParams,
    });
  }
}
