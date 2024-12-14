import { Supplier } from '@prisma/client';

export class SupplierDto {
  items_per_page?: number;
  page?: number;
  search?: string;
}

export class SupplierPaginationResponseType {
  data: Supplier[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
