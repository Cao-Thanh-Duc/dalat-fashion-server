import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CategoryProductController } from './category-product.controller';
import { CategoryProductService } from './category-product.service';

@Module({
  controllers: [CategoryProductController],
  providers: [CategoryProductService, PrismaService, JwtService],
})
export class CategoryProductModule {}
