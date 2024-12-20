import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
