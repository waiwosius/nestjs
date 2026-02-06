import { Injectable } from '@nestjs/common';
import { AbstractRepositoryService } from '../../common/abstract-repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryRepository extends AbstractRepositoryService<Category> {
  constructor(
    @InjectRepository(Category)
    protected readonly repository: Repository<Category>,
  ) {
    super(repository, 'category');
  }

  findAll() {
    return this.repository
      .createQueryBuilder(this.alias)
      .orderBy('category.order')
      .getMany();
  }

  countByParentId(parentId: number) {
    return this.repository
      .createQueryBuilder(this.alias)
      .where('parent_id = :parentId', { parentId })
      .getCount();
  }
}
