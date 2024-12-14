import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SizeProduct } from 'src/enums/product.enum';

export class UpdateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  sale_price: number;

  @ApiProperty()
  @IsNotEmpty()
  size: SizeProduct;

  @ApiProperty()
  @IsNotEmpty()
  unit: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  CateID: string;

  @ApiProperty()
  @IsNotEmpty()
  SuppID: string;

  @ApiProperty()
  @IsNotEmpty()
  image: string;
}
