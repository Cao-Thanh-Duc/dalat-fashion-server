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
import { Supplier } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';
import { HandleAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { CreateSupplierDto } from 'src/modules/supplier/dto/create.dto';
import {
  SupplierDto,
  SupplierPaginationResponseType,
} from 'src/modules/supplier/dto/supplier.dto';
import { SupplierService } from 'src/modules/supplier/supplier.service';

@ApiBearerAuth()
@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({ summary: 'Lấy tất cả các nhà cung cấp' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAll(
    @Query() params: SupplierDto,
  ): Promise<SupplierPaginationResponseType> {
    return this.supplierService.getAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết nhà cung cấp' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getDetail(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.getDetail(id);
  }

  @UseGuards(HandleAuthGuard)
  @Post()
  @Roles('ADMIN', 'EMPLOYEE')
  @ApiOperation({ summary: 'Thêm nhà cung cấp' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async addSupplier(@Body() data: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.addSupplier(data);
  }

  @UseGuards(HandleAuthGuard)
  @Put(':id')
  @Roles('ADMIN', 'EMPLOYEE')
  @ApiOperation({ summary: 'Cập nhật nhà cung cấp' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateSupplier(
    @Param('id') id: string,
    @Body() data: CreateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.updateSupplier(id, data);
  }

  @UseGuards(HandleAuthGuard)
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa nhà cung cấp' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteSupplier(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.deleteSupplier(id);
  }
}
