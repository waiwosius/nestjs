import { IsOptional, IsString } from 'class-validator';
import { PageRequest } from '../../../common/page.request';

export class ProductSearchRequest extends PageRequest {
  @IsOptional()
  @IsString()
  search: string;
}
