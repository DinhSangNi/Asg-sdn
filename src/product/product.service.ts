import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductCreateUpdateDto } from 'src/dto/request/product-create-update.dto';
import { ProductDeleteDto } from 'src/dto/request/product-delete.dto';
import { ProductQueryDto } from 'src/dto/request/product-query.dto';
import { PaginationResultDto } from 'src/dto/response/pagination-result.dto';
import { Product } from 'src/entity/product.schema';
import { ProductRepository } from 'src/repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllProducts(
    query: ProductQueryDto,
  ): Promise<PaginationResultDto<Product>> {
    const filtersParams: Record<string, any> = {};

    if (query.keyword !== undefined) {
      filtersParams.name = {
        $regex: query.keyword,
        $options: 'i',
      };
    }

    if (query.minPrice >= 0 && query.minPrice !== undefined) {
      filtersParams.price = {
        $gte: query.minPrice,
      };
    }

    if (query.maxPrice !== undefined) {
      if (filtersParams.price === undefined) {
        filtersParams.price = {
          $lte: query.maxPrice,
        };
      } else {
        filtersParams.price = {
          ...filtersParams.price,
          $lte: query.maxPrice,
        };
      }
    }

    const products = await this.productRepository.findAll(
      query.page,
      query.pageSize,
      filtersParams,
    );

    const total = await this.productRepository.count(filtersParams);

    return {
      data: products.map((product) => product.toObject()),
      total: total,
      totalPages: Math.ceil(total / query.pageSize),
      hasMore: query.page * query.pageSize < total,
    } as PaginationResultDto<Product>;
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) throw new NotFoundException('Product Id not found');
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product.toObject();
  }

  async createProduct(
    productDto: ProductCreateUpdateDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const cloudianaryResponses = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );
    const urls = cloudianaryResponses.map((res) => res.secure_url);
    const updatedProduct = { ...productDto, image: urls };
    return (await this.productRepository.create(updatedProduct)).toObject();
  }

  async updateProduct(
    productDto: ProductCreateUpdateDto,
    id: string,
    files: Express.Multer.File[],
  ) {
    const existedProduct = await this.productRepository.findById(id);
    if (!existedProduct) {
      throw new NotFoundException(`Product's id not found`);
    }

    let updatedProduct = {
      ...productDto,
      image: [...existedProduct.image],
    };

    if (files.length !== 0) {
      const cloudianaryResponses = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadFile(file)),
      );
      const urls = cloudianaryResponses.map((res) => res.secure_url);
      updatedProduct = {
        ...updatedProduct,
        image: [...updatedProduct.image, ...urls],
      };
    }

    return await this.productRepository.findByIdAndUpdate(id, updatedProduct);
  }

  async deleteProduct(productDeleteDto: ProductDeleteDto): Promise<Product> {
    const deletedProduct = await this.productRepository.delete(
      productDeleteDto.id,
    );
    if (!deletedProduct) throw new NotFoundException('Product not found');
    return deletedProduct.toObject();
  }
}
