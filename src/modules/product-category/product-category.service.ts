import { Injectable } from '@nestjs/common';
import { AbstractEntityService } from '../../common/abstract-entity.service';
import { ProductCategoryRepository } from './product-category.repository';
import { ProductCategory } from './product-category.entity';

@Injectable()
export class ProductCategoryService extends AbstractEntityService<ProductCategory> {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {
    super(productCategoryRepository, 'ProductCategory');
  }

  async findCategoryIdsByProductId(productId: number) {
    const productCategories =
      await this.productCategoryRepository.findByProductId(productId);
    if (!productCategories || !productCategories.length) {
      return [];
    }

    return productCategories.map(
      (productCategory) => productCategory.categoryId,
    );
  }
}
