import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
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
import { UserSearchRepository } from './user-search.repository';
import { UserSearchRequest } from './requests/user-search.request';
import { PageSerialize } from '../../interceptors/page-serialize.interceptor';

@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userSearchRepository: UserSearchRepository,
  ) {}

  @Roles(UserRole.admin)
  @PageSerialize(UserDto)
  @Get()
  async search(@Query() query: UserSearchRequest) {
    const { limit, offset, search } = query;

    const [users, total] = await this.userSearchRepository.search({
      limit,
      offset,
      search,
    });

    return {
      items: users,
      total,
      limit,
      offset,
    };
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
