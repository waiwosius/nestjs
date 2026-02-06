import { Injectable } from '@nestjs/common';
import { TestServiceInterface } from './test-service.interface';
import { TestDatabaseService } from './test-database.service';
import { Category } from '../../src/modules/category/category.entity';

@Injectable()
export class CategoryTestService implements TestServiceInterface {
  constructor(private readonly database: TestDatabaseService) {}

  create(params?: Partial<Category>) {
    return this.repository().save(this.fixture(params));
  }

  fixture(params: Partial<Category> = {}) {
    const {
      title = 'Category 1',
      description = 'Category description',
      order = 1,
      parentId = null,
    } = params;

    return new Category()
      .setTitle(title)
      .setDescription(description)
      .setOrder(order)
      .setParentId(parentId);
  }

  repository() {
    return this.database.getRepository(Category);
  }
}
