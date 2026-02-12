import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  /**
   * Validates password.
   *
   * @param providedPassword
   * @param userPassword value stored in database.
   */
  async validatePassword(providedPassword: string, userPassword: string) {
    const isEqual = await argon2.verify(userPassword, providedPassword);

    if (!isEqual) {
      throw new UnauthorizedException('Wrong password');
    }
    return true;
  }

  /**
   * Creates password value to store.
   *
   * @param password
   * @private
   */
  createPassword(password: string) {
    return argon2.hash(password);
  }

  /**
   * Creates access token.
   *
   * @param userId
   * @private
   */
  async createAccessToken(userId: number) {
    return await this.jwtService.signAsync({ userId });
  }
}
