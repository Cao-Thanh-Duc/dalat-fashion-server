import { Injectable } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { CreateSupplierDto } from 'src/modules/supplier/dto/create.dto';
import {
  SupplierDto,
  SupplierPaginationResponseType,
} from 'src/modules/supplier/dto/supplier.dto';
import { UpdateSupplierDto } from 'src/modules/supplier/dto/update.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prismaService: PrismaService) {}

  async getAll(filter: SupplierDto): Promise<SupplierPaginationResponseType> {
    const items_per_page = filter.items_per_page || 10;
    const page = filter.page || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const where = search
      ? {
          OR: [{ name: { contains: search } }],
        }
      : {};

    const suppliers = await this.prismaService.supplier.findMany({
      where,
      skip,
      take: items_per_page,
      select: {
        id: true,
        name: true,
      },
    });

    const totalSuppliers = await this.prismaService.supplier.count({
      where,
    });

    return {
      data: suppliers,
      total: totalSuppliers,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: string) {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
    });

    return supplier;
  }

  async addSupplier(data: CreateSupplierDto): Promise<Supplier> {
    const supplier = await this.prismaService.supplier.create({
      data: {
        name: data.name,
      },
    });

    return supplier;
  }

  async updateSupplier(id: string, data: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.prismaService.supplier.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return supplier;
  }

  async deleteSupplier(id: string): Promise<Supplier> {
    const supplier = await this.prismaService.supplier.delete({
      where: { id },
    });

    return supplier;
  }
}
