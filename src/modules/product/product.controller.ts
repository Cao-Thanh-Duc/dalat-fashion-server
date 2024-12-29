import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Products } from '@prisma/client';
import { CreateProductDto } from 'src/modules/product/dto/create.dto';
import {
  ProductsDto,
  ProductsPaginationResponseType,
} from 'src/modules/product/dto/product.dto';
import { UpdateProductDto } from 'src/modules/product/dto/update.dto';
import { ProductService } from 'src/modules/product/product.service';

@ApiBearerAuth()
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả sản phẩm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAll(
    @Query() params: ProductsDto,
  ): Promise<ProductsPaginationResponseType> {
    return this.productService.getAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getDetail(@Param('id') id: string): Promise<Products> {
    return this.productService.getDetail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async addProduct(@Body() data: CreateProductDto): Promise<Products> {
    return this.productService.addProduct(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateProduct(
    @Param('id') id: string,
    @Query() data: UpdateProductDto,
  ): Promise<Products> {
    return this.productService.updateProduct(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteProduct(@Param('id') id: string): Promise<Products> {
    return this.productService.deleteProduct(id);
  }
}
