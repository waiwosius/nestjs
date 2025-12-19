import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  findById(id: number) {
    return this.repository
      .createQueryBuilder('product')
      .where('id = :id', { id })
      .getOne();
  }

  save(entity: Product) {
    return this.repository.save(entity);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
