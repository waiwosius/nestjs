import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserRequest } from '../authentication/requests/create-user.request';
import { UserRepository } from './user.repository';
import { UpdateUserRequest } from './requests/update-user.request';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneOrFail(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmailOrFail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(request: CreateUserRequest, hashPassword: string) {
    const { firstName, lastName, email } = request;

    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    return await this.userRepository.save(
      new User()
        .setFirstName(firstName)
        .setLastName(lastName)
        .setEmail(email)
        .setPassword(hashPassword),
    );
  }

  async update(userId: number, request: UpdateUserRequest) {
    const user = await this.findOneOrFail(userId);
    const { firstName, lastName, role } = request;

    return this.userRepository.save(
      user.setFirstName(firstName).setLastName(lastName).setRole(role),
    );
  }

  async delete(userId: number) {
    const user = await this.findOneOrFail(userId);

    await this.userRepository.delete(user.id);
  }
}
