import { IsOptional, IsString } from 'class-validator';
import { PageRequest } from '../../../common/page.request';

export class UserSearchRequest extends PageRequest {
  @IsOptional()
  @IsString()
  search: string;
}
