import { Injectable } from '@nestjs/common';
import { SearchRepositoryInterface } from '../../interfaces/search-repository.interface';
import { UserRepository } from './user.repository';
import { SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserSearchRepository
  extends UserRepository
  implements SearchRepositoryInterface
{
  search(params: { limit: number; offset: number; search?: string }) {
    const { limit, offset, search } = params;
    const queryBuilder = this.createQueryBuilder();

    this.searchFilter(queryBuilder, search);

    return queryBuilder
      .take(limit)
      .skip(offset)
      .orderBy('user.created_date')
      .getManyAndCount();
  }

  private searchFilter(
    queryBuilder: SelectQueryBuilder<User>,
    search?: string,
  ) {
    if (!search) return;

    queryBuilder.andWhere('user.first_name LIKE :search', {
      search: `%${search}%`,
    });
  }
}
