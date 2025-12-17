import { IsNotEmpty, IsString } from 'class-validator';

export class SignInUserRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
