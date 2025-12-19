import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProductRepository } from './product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthenticationModule],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
