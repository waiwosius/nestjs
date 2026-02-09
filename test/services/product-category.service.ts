import { Injectable } from '@nestjs/common';
import { TestDatabaseService } from './test-database.service';
import { TestServiceInterface } from './test-service.interface';
import { ProductCategory } from '../../src/modules/product-category/product-category.entity';

@Injectable()
export class ProductCategoryTestService implements TestServiceInterface {
  constructor(private readonly database: TestDatabaseService) {}

  create(params?: Partial<ProductCategory>) {
    return this.repository().save(this.fixture(params));
  }

  fixture(params: Partial<ProductCategory> = {}) {
    const { productId, categoryId } = params;

    return new ProductCategory()
      .setProductId(productId)
      .setCategoryId(categoryId);
  }

  repository() {
    return this.database.getRepository(ProductCategory);
  }
}
