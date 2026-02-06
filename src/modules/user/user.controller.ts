import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequest } from './requests/create-user.request';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserRequest) {
    return this.userService.create(body);
  }
}
