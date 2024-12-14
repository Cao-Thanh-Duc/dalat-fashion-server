import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSupplierDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
