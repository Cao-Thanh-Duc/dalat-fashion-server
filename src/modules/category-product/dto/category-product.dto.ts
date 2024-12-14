import { ProductCategory } from '@prisma/client';

export class CategoryProductDto {
  items_per_page?: number;
  page?: number;
  search?: string;
}

export interface ProductCategoryPaginationResponseType {
  data: ProductCategory[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
