import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
