import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProductRepository } from './product.repository';
import { ProductSearchRepository } from './product-search.repository';
import { PublicProductController } from './public-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthenticationModule],
  providers: [ProductService, ProductSearchRepository, ProductRepository],
  controllers: [ProductController, PublicProductController],
})
export class ProductModule {}
