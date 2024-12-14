import { Roles } from '@prisma/client';

export class RoleDto {
  search?: string;
}

export interface RoleResponseType {
  data: Roles[];
  total: number;
}
