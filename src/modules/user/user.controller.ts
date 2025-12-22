import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UpdateUserRequest } from './requests/update-user.request';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from './user.entity';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from './user-role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { PublicUserDto } from './public-user.dto';
import { UserDto } from './user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Roles(UserRole.admin)
  @Serialize(UserDto)
  @Get()
  async getAll() {
    return await this.userRepository.findAll();
  }

  @Serialize(PublicUserDto)
  @Get('/profile')
  async getProfile(@CurrentUser() user: User) {
    return await this.userService.findOneOrFail(user.id);
  }

  @Roles(UserRole.admin)
  @Serialize(UserDto)
  @Get(':id')
  async getOne(@Param('id') userId: number) {
    return await this.userService.findOneOrFail(userId);
  }

  @Roles(UserRole.admin)
  @Serialize(UserDto)
  @Put(':id')
  async update(@Param('id') userId: number, @Body() body: UpdateUserRequest) {
    return this.userService.update(userId, body);
  }

  @Roles(UserRole.admin)
  @Delete(':id')
  delete(@Param('id') userId: number) {
    return this.userService.delete(userId);
  }
}
