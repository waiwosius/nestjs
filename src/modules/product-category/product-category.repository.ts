import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepositoryService } from '../../common/abstract-repository.service';
import { ProductCategory } from './product-category.entity';

@Injectable()
export class ProductCategoryRepository extends AbstractRepositoryService<ProductCategory> {
  constructor(
    @InjectRepository(ProductCategory)
    protected readonly repository: Repository<ProductCategory>,
  ) {
    super(repository, 'product_category');
  }

  findByProductId(productId: number) {
    return this.repository
      .createQueryBuilder(this.alias)
      .where(`${this.alias}.product_id = :productId`, { productId })
      .getMany();
  }
}
