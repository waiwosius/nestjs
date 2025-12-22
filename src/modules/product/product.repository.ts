import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { AbstractRepositoryService } from '../../common/abstract-repository.service';

@Injectable()
export class ProductRepository extends AbstractRepositoryService<Product> {
  constructor(
    @InjectRepository(Product)
    protected readonly repository: Repository<Product>,
  ) {
    super(repository, 'product');
  }
}
