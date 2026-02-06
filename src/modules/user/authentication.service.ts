import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class AuthenticationService {
  private readonly iterations = 10000;
  private readonly keylen = 64;
  private readonly digest = 'sha512';

  constructor() {}

  hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, this.iterations, this.keylen, this.digest)
      .toString('hex');
    return salt + '.' + hash;
  }
}
