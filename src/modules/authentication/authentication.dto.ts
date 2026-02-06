import { Expose, Type } from 'class-transformer';
import { UserDto } from '../user/user.dto';

export class AuthenticationDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  accessToken: string;
}
