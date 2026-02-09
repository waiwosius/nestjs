import { Expose, Type } from 'class-transformer';
import { CategoryDto } from '../category/category.dto';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  number: string;

  @Expose()
  @Type(() => CategoryDto)
  categories: CategoryDto[];
}
