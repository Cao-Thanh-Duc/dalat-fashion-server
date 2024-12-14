import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';
import { HandleAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { CategoryProductService } from 'src/modules/category-product/category-product.service';
import {
  CategoryProductDto,
  ProductCategoryPaginationResponseType,
} from 'src/modules/category-product/dto/category-product.dto';
import { CreateCategoryProductDto } from 'src/modules/category-product/dto/create.dto';

@ApiBearerAuth()
@ApiTags('category-product')
@Controller('category-product')
export class CategoryProductController {
  constructor(private categoryProductService: CategoryProductService) {}

  // Add more endpoints here
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({ summary: 'Lấy tất cả các danh mục sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAll(
    @Query() params: CategoryProductDto,
  ): Promise<ProductCategoryPaginationResponseType> {
    return this.categoryProductService.getAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getDetail(@Param('id') id: string): Promise<ProductCategory> {
    return this.categoryProductService.getDetail(id);
  }

  @UseGuards(HandleAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Thêm danh mục sản phẩm' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async addCategoryProduct(
    @Body() data: CreateCategoryProductDto,
  ): Promise<ProductCategory> {
    return this.categoryProductService.addCategoryProduct(data);
  }

  @UseGuards(HandleAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateCategoryProduct(
    @Param('id') id: string,
    @Body() data: CreateCategoryProductDto,
  ): Promise<ProductCategory> {
    return this.categoryProductService.updateCategoryProduct(id, data);
  }

  @UseGuards(HandleAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteCategoryProduct(
    @Param('id') id: string,
  ): Promise<ProductCategory> {
    return this.categoryProductService.deleteCategoryProduct(id);
  }
}
