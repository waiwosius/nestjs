import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;
}
