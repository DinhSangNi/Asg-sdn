import { IsNotEmpty, IsString } from 'class-validator';

export class ProductDeleteDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
