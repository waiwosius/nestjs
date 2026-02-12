import { Injectable } from '@nestjs/common';
import { TestServiceInterface } from './test-service.interface';
import { User } from '../../src/modules/user/user.entity';
import { TestDatabaseService } from './test-database.service';
import { UserRole } from '../../src/modules/user/user-role.enum';

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
      password = '$argon2id$v=19$m=65536,t=3,p=4$BEpXwW15WEjtiitlcurSJw$Mw4hlmCSLVWAylQHXRZHzUHtht1K8r33y4sfTgJV6Co',
      role = UserRole.admin,
    } = params;

    return new User()
      .setFirstName(firstName)
      .setLastName(lastName)
      .setEmail(email)
      .setPassword(password)
      .setRole(role);
  }

  repository() {
    return this.database.getRepository(User);
  }
}
