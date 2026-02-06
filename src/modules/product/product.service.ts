import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRequest } from './requests/product.request';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findOneOrFail(productId: number) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
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

  async delete(productId: number) {
    const product = await this.findOneOrFail(productId);

    await this.productRepository.delete(product.id);
  }
}
