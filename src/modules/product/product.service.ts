import { Injectable } from '@nestjs/common';
import { ProductRequest } from './requests/product.request';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { AbstractEntityService } from '../../common/abstract-entity.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService extends AbstractEntityService<Product> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {
    super(productRepository, 'Product');
  }

  async create(request: ProductRequest) {
    const categories = await this.categoryService.findByIds(
      request.categoryIds,
    );
    return this.save(new Product(), request, categories);
  }

  async update(productId: number, request: ProductRequest) {
    const [product, categories] = await Promise.all([
      this.findOneOrFail(productId),
      this.categoryService.findByIds(request.categoryIds),
    ]);
    return this.save(product, request, categories);
  }

  private save(
    product: Product,
    { title, description, number }: ProductRequest,
    categories: Category[],
  ) {
    return this.productRepository.save(
      product
        .setNumber(number)
        .setTitle(title)
        .setDescription(description)
        .setCategories(categories),
    );
  }
}
