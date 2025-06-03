import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCreateUpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber({ allowNaN: false }, { message: 'Price must be a number' })
  price: number;
}
