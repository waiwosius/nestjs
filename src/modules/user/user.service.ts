import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserRequest } from './requests/create-user.request';

@Injectable()
export class UserService {
  constructor() {}

  async create(request: CreateUserRequest) {
    const { firstName, lastName, email, password } = request;

    return new User()
      .setFirstName(firstName)
      .setLastName(lastName)
      .setEmail(email)
      .setPassword(password);
  }
}
