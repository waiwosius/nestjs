import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CreateUserRequest } from '../../src/modules/authentication/requests/create-user.request';
import supertest from 'supertest';
import { getMainModule } from '../app';
import { TestDatabaseService } from '../services/test-database.service';
import { AuthenticationDto } from '../../src/modules/authentication/authentication.dto';
import { SignInUserRequest } from '../../src/modules/authentication/requests/sign-in-user.request';
import { UserTestService } from '../services/user-test.service';

describe('/authentication', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabaseService: TestDatabaseService;
  let userTestService: UserTestService;

  beforeAll(async () => {
    module = await getMainModule();
    testDatabaseService = module.get<TestDatabaseService>(TestDatabaseService);
    userTestService = module.get<UserTestService>(UserTestService);

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await testDatabaseService.cleanDatabase();
  });

  afterAll(async () => {
    await testDatabaseService.closeDatabaseConnection();
    await app.close();
  });

  describe('POST /authentication', () => {
    describe('/sign-up', () => {
      it('should create and return a user', async () => {
        const request = {
          firstName: 'Lara',
          lastName: 'Croft',
          email: 'lara@croft.com',
          password: 'p@$$w0rd',
        } as CreateUserRequest;

        const response = await supertest(app.getHttpServer())
          .post('/authentication/sign-up')
          .send(request)
          .expect(201);

        const result = response.body as AuthenticationDto;
        expect(result.accessToken).toBeDefined();

        const user = result.user;
        expect(user.id).toBeDefined();
        expect(user.firstName).toBe(request.firstName);
        expect(user.lastName).toBe(request.lastName);
        expect(user.email).toBe(request.email);
        expect(user).not.toHaveProperty('password');
      });

      it('should throw an error when email is not provided', async () => {
        const request = {
          firstName: 'Lara',
          lastName: 'Croft',
          password: 'p@$$w0rd',
        } as CreateUserRequest;

        await supertest(app.getHttpServer())
          .post('/authentication/sign-up')
          .send(request)
          .expect(400);
      });

      it('should throw an error when the password is too short', async () => {
        const request = {
          firstName: 'Lara',
          lastName: 'Croft',
          email: 'lara@croft.com',
          password: 'p@$$',
        } as CreateUserRequest;

        await supertest(app.getHttpServer())
          .post('/authentication/sign-up')
          .send(request)
          .expect(400);
      });
    });

    describe('/sign-in', () => {
      it('should be able to sign in', async () => {
        const user = await userTestService.create();
        const request = {
          email: user.email,
          password: 'p@$$w0rd',
        } as SignInUserRequest;

        const response = await supertest(app.getHttpServer())
          .post('/authentication/sign-in')
          .send(request)
          .expect(200);

        const result = response.body as AuthenticationDto;
        expect(result.accessToken).toBeDefined();

        const signInUser = result.user;
        expect(signInUser.id).toBe(user.id);
        expect(signInUser.firstName).toBe(user.firstName);
        expect(signInUser.lastName).toBe(user.lastName);
        expect(signInUser.email).toBe(user.email);
        expect(signInUser).not.toHaveProperty('password');
      });

      it('should throw an error when password is wrong', async () => {
        const user = await userTestService.create();
        const request = {
          email: user.email,
          password: 'wr0ngp@$$w0rd',
        } as SignInUserRequest;

        await supertest(app.getHttpServer())
          .post('/authentication/sign-in')
          .send(request)
          .expect(400);
      });
    });
  });
});
