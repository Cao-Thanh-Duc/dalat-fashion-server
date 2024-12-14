import { Injectable } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';
import {
  CategoryProductDto,
  ProductCategoryPaginationResponseType,
} from 'src/modules/category-product/dto/category-product.dto';
import { CreateCategoryProductDto } from 'src/modules/category-product/dto/create.dto';
import { UpdateCategoryProductDto } from 'src/modules/category-product/dto/update.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryProductService {
  constructor(private prismaService: PrismaService) {}

  async getAll(
    filter: CategoryProductDto,
  ): Promise<ProductCategoryPaginationResponseType> {
    const items_per_page = filter.items_per_page || 10;
    const page = filter.page || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const where = search
      ? {
          OR: [{ name: { contains: search } }],
        }
      : {};

    const categories = await this.prismaService.productCategory.findMany({
      where,
      skip,
      take: items_per_page,
      select: {
        id: true,
        name: true,
      },
    });

    const totalCategories = await this.prismaService.productCategory.count({
      where,
    });

    return {
      data: categories,
      total: totalCategories,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: string) {
    const category = await this.prismaService.productCategory.findUnique({
      where: { id },
    });

    return category;
  }

  async addCategoryProduct(
    data: CreateCategoryProductDto,
  ): Promise<ProductCategory> {
    return await this.prismaService.productCategory.create({
      data,
    });
  }

  async updateCategoryProduct(
    id: string,
    data: UpdateCategoryProductDto,
  ): Promise<ProductCategory> {
    return await this.prismaService.productCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategoryProduct(id: string): Promise<ProductCategory> {
    return await this.prismaService.productCategory.delete({
      where: { id },
    });
  }
}
