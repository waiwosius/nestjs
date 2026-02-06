import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  parentId: number;

  @Expose()
  order: number;

  @Expose()
  title: string;

  @Expose()
  description: string;
}
