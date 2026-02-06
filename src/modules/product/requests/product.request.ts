import { IsNotEmpty, IsString } from 'class-validator';

export class ProductRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}
