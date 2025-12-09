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

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  async getAll() {
    return await this.userRepository.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') userId: number) {
    return await this.userService.findOneOrFail(userId);
  }

  @Post()
  async create(@Body() body: CreateUserRequest) {
    return await this.userService.create(body);
  }

  @Put(':id')
  async update(@Param('id') userId: number, @Body() body: UpdateUserRequest) {
    return this.userService.update(userId, body);
  }

  @Delete(':id')
  async delete(@Param('id') userId: number) {
    return this.userService.delete(userId);
  }
}
