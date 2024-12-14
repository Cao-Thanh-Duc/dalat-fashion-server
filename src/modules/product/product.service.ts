import { Injectable } from '@nestjs/common';
import { SizeProduct } from 'src/enums/product.enum';
import { CreateProductDto } from 'src/modules/product/dto/create.dto';
import {
  ProductsDto,
  ProductsPaginationResponseType,
} from 'src/modules/product/dto/product.dto';
import { UpdateProductDto } from 'src/modules/product/dto/update.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async getAll(filter: ProductsDto): Promise<ProductsPaginationResponseType> {
    const items_per_page = filter.items_per_page || 10;
    const page = filter.page || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    // Điều kiện tìm kiếm
    const where = search
      ? {
          OR: [{ name: { contains: search } }],
        }
      : {};

    // Lấy danh sách sản phẩm kèm theo size
    const products = await this.prismaService.products.findMany({
      where,
      skip,
      take: items_per_page,
      include: {
        size: true, // Bao gồm danh sách các size
      },
    });

    // Tổng số sản phẩm
    const totalProducts = await this.prismaService.products.count({
      where,
    });

    return {
      data: products,
      total: totalProducts,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: string) {
    const product = await this.prismaService.products.findUnique({
      where: { id },
      include: {
        size: true,
      },
    });

    return product;
  }

  async addProduct(data: CreateProductDto) {
    try {
      const sizes = Object.values(SizeProduct);

      const product = await this.prismaService.$transaction(async (prisma) => {
        const newProduct = await prisma.products.create({
          data: {
            name: data.name,
            price: data.price,
            description: data.description,
            sale_price: data.sale_price,
            unit: data.unit,
            image: data.image,
            quantity: data.quantity,
            Category: data.CateID
              ? {
                  connect: {
                    id: data.CateID,
                  },
                }
              : undefined,
            Supplier: data.SuppID
              ? {
                  connect: {
                    id: data.SuppID,
                  },
                }
              : undefined,
          },
        });

        await prisma.productSize.createMany({
          data: sizes.map((size) => ({
            size,
            productId: newProduct.id,
          })),
        });

        return newProduct;
      });

      return product;
    } catch (error) {
      throw new Error(`Failed to add product with sizes: ${error.message}`);
    }
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const product = await this.prismaService.products.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        sale_price: data.sale_price,
        unit: data.unit,
        image: data.image,
        quantity: data.quantity,
        Category: {
          connect: {
            id: data.CateID,
          },
        },
        Supplier: {
          connect: {
            id: data.SuppID,
          },
        },
      },
    });

    return product;
  }

  async deleteProduct(id: string) {
    const product = await this.prismaService.products.delete({
      where: { id },
    });

    return product;
  }
}
