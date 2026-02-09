import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryRepository } from './product-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoryService, ProductCategoryRepository],
  controllers: [],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
