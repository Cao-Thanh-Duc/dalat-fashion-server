import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/enums/user.enum';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  status: number;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  fullname?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  phone?: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsOptional()
  gender?: UserGender;

  @ApiProperty()
  @IsOptional()
  birth_date?: string;
}

export interface UserFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
}

export interface UserPaginationResponseType {
  data: Users[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
