import { Injectable } from '@nestjs/common';
import { ProductRequest } from './requests/product.request';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { AbstractEntityService } from '../../common/abstract-entity.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService extends AbstractEntityService<Product> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {
    super(productRepository, 'Product');
  }

  async create(request: ProductRequest) {
    const { title, description, number, categoryIds } = request;
    const categories = await this.categoryService.findByIds(categoryIds);

    return this.productRepository.save(
      new Product()
        .setTitle(title)
        .setDescription(description)
        .setNumber(number)
        .setCategories(categories),
    );
  }

  async update(productId: number, request: ProductRequest) {
    const product = await this.findOneOrFail(productId);
    const { title, description, number, categoryIds } = request;
    const categories = await this.categoryService.findByIds(categoryIds);

    return await this.productRepository.save(
      product
        .setNumber(number)
        .setTitle(title)
        .setDescription(description)
        .setCategories(categories),
    );
  }
}
