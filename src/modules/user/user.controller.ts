import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { HandleAuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  UpdateUserDto,
  UserFilterType,
  UserPaginationResponseType,
} from 'src/modules/user/dto/user.dto';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithUser } from 'src/types/users';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(HandleAuthGuard)
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiOperation({ summary: 'Lấy ra thông tin user đang đăng nhập' })
  async getCurrentUser(
    @Req() req,
  ): Promise<Omit<Users, 'password' | 'confirmPassword'>> {
    const userId = req.user.id;
    const user = await this.userService.getDetail(userId);
    return user;
  }

  @Get('/count-user')
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiOperation({ summary: 'Lấy ra số lượng user' })
  async countUser(): Promise<{ data: { total: number } }> {
    return this.userService.getCountUser();
  }

  @UseGuards(HandleAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiOperation({ summary: 'Lấy ra danh sách user' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAll(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    return this.userService.getAll(params);
  }

  @UseGuards(HandleAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiOperation({ summary: 'Lấy ra thông tin chi tiết user' })
  getDetail(
    @Param('id') id: string,
  ): Promise<Omit<Users, 'password' | 'confirmPassword'>> {
    return this.userService.getDetail(id);
  }

  @UseGuards(HandleAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/role')
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiOperation({ summary: 'Cập nhật role cho user' })
  async updateUserRole(
    @Param('id') id: string,
    @Body('roleId') roleId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.userService.updateUserRole(id, roleId, userId);
  }

  @UseGuards(HandleAuthGuard)
  @Put('me')
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiOperation({ summary: 'Cập nhật thông tin user đang đăng nhập' })
  async updateMe(@Req() req, @Body() data: UpdateUserDto) {
    return this.userService.updateMeUser(data, req.user.id);
  }

  @UseGuards(HandleAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    const currentUserId = req.user.id;
    return this.userService.deleteUser(id, currentUserId);
  }
}
