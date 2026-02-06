import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsOptional()
  parentId: number;
}
