import { Injectable } from '@nestjs/common';
import { SearchRepositoryInterface } from '../../interfaces/search-repository.interface';
import { SelectQueryBuilder } from 'typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';

@Injectable()
export class ProductSearchRepository
  extends ProductRepository
  implements SearchRepositoryInterface
{
  search(params: { limit: number; offset: number; search?: string }) {
    const { limit, offset, search } = params;
    const queryBuilder = this.createQueryBuilder();

    this.searchFilter(queryBuilder, search);

    return queryBuilder
      .take(limit)
      .skip(offset)
      .orderBy(`created_date`)
      .getManyAndCount();
  }

  private searchFilter(
    queryBuilder: SelectQueryBuilder<Product>,
    search?: string,
  ) {
    if (!search) return;

    queryBuilder.andWhere(`title LIKE :search`, {
      search: `%${search}%`,
    });
  }
}
