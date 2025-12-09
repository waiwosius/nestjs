import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
