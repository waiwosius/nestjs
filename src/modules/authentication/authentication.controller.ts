import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateUserRequest } from './requests/create-user.request';
import { UserService } from '../user/user.service';
import { SignInUserRequest } from './requests/sign-in-user.request';
import { AuthenticationDto } from './authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Serialize(AuthenticationDto)
  @Post('/sign-up')
  async create(@Body() body: CreateUserRequest) {
    const hashedPassword = this.authenticationService.createPassword(
      body.password,
    );
    const user = await this.userService.create(body, hashedPassword);

    return {
      user,
      accessToken: await this.authenticationService.createAccessToken(user.id),
    };
  }

  @Serialize(AuthenticationDto)
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(@Body() body: SignInUserRequest) {
    const { email, password } = body;

    const user = await this.userService.findByEmailOrFail(email);
    await this.authenticationService.validatePassword(password, user.password);

    return {
      user,
      accessToken: await this.authenticationService.createAccessToken(user.id),
    };
  }
}
