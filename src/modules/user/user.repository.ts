import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AbstractRepositoryService } from '../../common/abstract-repository.service';

@Injectable()
export class UserRepository extends AbstractRepositoryService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository, 'user');
  }

  findByEmail(email: string) {
    return this.repository
      .createQueryBuilder(this.alias)
      .where('email = :email', { email })
      .getOne();
  }
}
