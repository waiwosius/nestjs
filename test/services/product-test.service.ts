import { Injectable } from '@nestjs/common';
import { TestServiceInterface } from './test-service.interface';
import { TestDatabaseService } from './test-database.service';
import { Product } from '../../src/modules/product/product.entity';

@Injectable()
export class ProductTestService implements TestServiceInterface {
  constructor(private readonly database: TestDatabaseService) {}

  create(params?: Partial<Product>) {
    return this.repository().save(this.fixture(params));
  }

  fixture(params: Partial<Product> = {}) {
    const {
      title = 'Test Product',
      description = 'Long Test Product description',
      number = 'a1b1',
    } = params;

    return new Product()
      .setTitle(title)
      .setDescription(description)
      .setNumber(number);
  }

  repository() {
    return this.database.getRepository(Product);
  }
}
