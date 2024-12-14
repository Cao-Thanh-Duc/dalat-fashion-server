import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { FileUploadService } from 'src/lib/file-upload.service';
import { UpdateUserDto, UserFilterType } from 'src/modules/user/dto/user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(filters: UserFilterType): Promise<any> {
    const items_per_page = filters.items_per_page || 10;
    const page = filters.page || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const where: Prisma.UsersWhereInput = search
      ? {
          OR: [
            { fullname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const users = await this.prismaService.users.findMany({
      where,
      skip,
      take: items_per_page,
      select: {
        UserID: true,
        email: true,
        fullname: true,
      },
    });

    const totalUsers = await this.prismaService.users.count({ where });

    return {
      data: users,
      total: totalUsers,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: string): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { UserID: id },
      select: {
        UserID: true,
        email: true,
        fullname: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async updateMeUser(data: UpdateUserDto, id: string): Promise<Users> {
    return await this.prismaService.users.update({
      where: {
        UserID: id,
      },
      data: {
        email: data.email,
        fullname: data.fullname,
        phone: data.phone,
        address: data.address,
        birth_date: data.birth_date,
        gender: data.gender,
      },
    });
  }

  async updateUserRole(
    userId: string, // ID của người dùng cần cập nhật
    roleId: string,
    currentUserId: string, // ID của người dùng hiện tại
  ): Promise<Users> {
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot update your own role.');
    }

    const role = await this.prismaService.roles.findUnique({
      where: { RoleID: roleId },
    });

    if (!role) {
      throw new HttpException(
        { message: 'Role not found.' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.prismaService.users.update({
      where: { UserID: userId },
      data: { RoleID: roleId },
    });
  }

  async deleteUser(
    userId: string,
    currentUserId: string,
  ): Promise<{ message: string }> {
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account.');
    }

    const user = await this.prismaService.users.findUnique({
      where: { UserID: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.prismaService.users.delete({
      where: { UserID: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async getCountUser(): Promise<{ data: { total: number } }> {
    const totalUsers = await this.prismaService.users.count();
    return { data: { total: totalUsers } };
  }
}
