import { Products } from '@prisma/client';

export class ProductsDto {
  items_per_page?: number;
  page?: number;
  search?: string;
}

export class ProductsPaginationResponseType {
  data: Products[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
