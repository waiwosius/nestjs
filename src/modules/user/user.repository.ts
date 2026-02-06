import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  findAll() {
    return this.repository.createQueryBuilder('user').getMany();
  }

  findById(id: number) {
    return this.repository
      .createQueryBuilder('user')
      .where('id = :id', { id })
      .getOne();
  }

  findByEmail(email: string) {
    return this.repository
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .getOne();
  }

  save(entity: User) {
    return this.repository.save(entity);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
