import { BadRequestException, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  private readonly iterations = 10000;
  private readonly keylen = 64;
  private readonly digest = 'sha512';

  constructor(private jwtService: JwtService) {}

  /**
   * Validates password.
   *
   * @param providedPassword
   * @param userPassword value stored in database.
   */
  async validatePassword(providedPassword: string, userPassword: string) {
    const [salt, storedHash] = userPassword.split('.');

    const hash = this.generateHash(providedPassword, salt);
    const isEqual = crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(hash, 'hex'),
    );

    if (!isEqual) {
      throw new BadRequestException('Wrong password');
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
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.generateHash(password, salt);
    return salt + '.' + hash;
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

  /**
   * Generates a hash using PBKDF2 for the given input and salt
   *
   * @param input The input string to hash
   * @param salt The salt to use for hashing
   * @returns The generated hash as a hex string
   * @private
   */
  private generateHash(input: string, salt: string) {
    return crypto
      .pbkdf2Sync(input, salt, this.iterations, this.keylen, this.digest)
      .toString('hex');
  }
}
