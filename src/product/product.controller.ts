import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductQueryDto } from 'src/dto/request/product-query.dto';
import { ApiResponse } from 'src/dto/response/api-response.dto';
import { PaginationResultDto } from 'src/dto/response/pagination-result.dto';
import { Product } from 'src/entity/product.schema';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductCreateUpdateDto } from 'src/dto/request/product-create-update.dto';
import { ProductDeleteDto } from 'src/dto/request/product-delete.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAllProducts(@Query() query: ProductQueryDto, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse<PaginationResultDto<Product>>(
          'Get all products successfully',
          await this.productService.getAllProducts(query),
        ),
      );
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse<Product>(
          'Get product by id successfully',
          await this.productService.getProductById(id),
        ),
      );
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: ProductCreateUpdateDto,
    @Res() res: Response,
  ) {
    return res
      .status(HttpStatus.CREATED)
      .json(
        new ApiResponse<Product>(
          'Create product successfully',
          await this.productService.createProduct(body, files),
        ),
      );
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: ProductCreateUpdateDto,
    @Res() res: Response,
  ) {
    await this.productService.updateProduct(body, id, files);
    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse<Product>(
          'Update product successfully',
          (await this.productService.updateProduct(body, id, files)) as Product,
        ),
      );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param() pproductDeleteDto: ProductDeleteDto,
    @Res() res: Response,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse<Product>(
          'Delete product by id successfully',
          await this.productService.deleteProduct(pproductDeleteDto),
        ),
      );
  }
}
