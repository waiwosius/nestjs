import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserRequest } from './requests/create-user.request';
import { UserRepository } from './user.repository';
import { AuthenticationService } from './authentication.service';
import { UpdateUserRequest } from './requests/update-user.request';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async findOneOrFail(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async create(request: CreateUserRequest) {
    const { firstName, lastName, email, password } = request;

    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    return await this.userRepository.save(
      new User()
        .setFirstName(firstName)
        .setLastName(lastName)
        .setEmail(email)
        .setPassword(this.authenticationService.hashPassword(password)),
    );
  }

  async update(userId: number, request: UpdateUserRequest) {
    const user = await this.findOneOrFail(userId);
    const { firstName, lastName } = request;

    return await this.userRepository.save(
      user.setFirstName(firstName).setLastName(lastName),
    );
  }

  async delete(userId: number) {
    const user = await this.findOneOrFail(userId);

    await this.userRepository.delete(user.id);
  }
}
