import { Injectable } from '@nestjs/common';
import { TestServiceInterface } from './test-service.interface';
import { User } from '../../src/modules/user/user.entity';
import { TestDatabaseService } from './test-database.service';

@Injectable()
export class UserTestService implements TestServiceInterface {
  constructor(private readonly database: TestDatabaseService) {}

  create(params?: Partial<User>) {
    return this.repository().save(this.fixture(params));
  }

  fixture(params: Partial<User> = {}) {
    const {
      firstName = 'Lara',
      lastName = 'Croft',
      email = 'lara@croft.com',
      //password: 'p@$$w0rd'
      password = '567fb3927bbc7421a4c83b3cd825a773.f2b0e1a852331dff676e097154355cb563a54e51dd1bd7ebdd29eb2490b2d6463b6f8a20aeb5d5c2304b23d45522c494a964c76d33bbffc74447c9bd78f6dbe9',
    } = params;

    return new User()
      .setFirstName(firstName)
      .setLastName(lastName)
      .setEmail(email)
      .setPassword(password);
  }

  repository() {
    return this.database.getRepository(User);
  }
}
