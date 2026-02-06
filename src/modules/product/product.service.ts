import { Injectable } from '@nestjs/common';
import { ProductRequest } from './requests/product.request';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { AbstractEntityService } from '../../common/abstract-entity.service';

@Injectable()
export class ProductService extends AbstractEntityService<Product> {
  constructor(private readonly productRepository: ProductRepository) {
    super(productRepository, 'Product');
  }

  create(request: ProductRequest) {
    const { title, description, number } = request;

    return this.productRepository.save(
      new Product()
        .setTitle(title)
        .setDescription(description)
        .setNumber(number),
    );
  }

  async update(productId: number, request: ProductRequest) {
    const product = await this.findOneOrFail(productId);
    const { title, description, number } = request;

    return await this.productRepository.save(
      product.setNumber(number).setTitle(title).setDescription(description),
    );
  }
}
