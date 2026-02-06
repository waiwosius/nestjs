import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserRequest } from './requests/create-user.request';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UpdateUserRequest } from './requests/update-user.request';
import { Serialize } from '../../interseptors/serialize.interceptor';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Serialize(UserDto)
  @Get()
  async getAll() {
    return await this.userRepository.findAll();
  }

  @Serialize(UserDto)
  @Get(':id')
  async getOne(@Param('id') userId: number) {
    return await this.userService.findOneOrFail(userId);
  }

  @Serialize(UserDto)
  @Post()
  async create(@Body() body: CreateUserRequest) {
    return await this.userService.create(body);
  }

  @Serialize(UserDto)
  @Put(':id')
  async update(@Param('id') userId: number, @Body() body: UpdateUserRequest) {
    return this.userService.update(userId, body);
  }

  @Delete(':id')
  async delete(@Param('id') userId: number) {
    return this.userService.delete(userId);
  }
}
