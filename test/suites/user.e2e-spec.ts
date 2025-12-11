import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CreateUserRequest } from '../../src/modules/user/requests/create-user.request';
import supertest from 'supertest';
import { getMainModule } from '../app';
import { TestDatabaseService } from '../test-database.service';
import { UserDto } from '../../src/modules/user/user.dto';

describe('/user', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabaseService: TestDatabaseService;

  beforeAll(async () => {
    module = await getMainModule();
    testDatabaseService = module.get<TestDatabaseService>(TestDatabaseService);

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

  describe('POST /user', () => {
    it('should return a user', async () => {
      const request = {
        firstName: 'Lara',
        lastName: 'Croft',
        email: 'lara@croft.com',
        password: 's3cr3tPass',
      } as CreateUserRequest;

      const response = await supertest(app.getHttpServer())
        .post('/user')
        .send(request)
        .expect(201);

      const result = response.body as UserDto;
      expect(result.firstName).toBe(request.firstName);
      expect(result.lastName).toBe(request.lastName);
      expect(result.email).toBe(request.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should return a user then firstName and lastName is not provided', async () => {
      const request = {
        email: 'lara@croft.com',
        password: 's3cr3tPass',
      } as CreateUserRequest;

      const response = await supertest(app.getHttpServer())
        .post('/user')
        .send(request)
        .expect(201);

      const result = response.body as UserDto;
      expect(result.firstName).toBeNull();
      expect(result.lastName).toBeNull();
      expect(result.email).toBe(request.email);
      expect(result).not.toHaveProperty('password');
    });

    it('throw error when an email is not provided', async () => {
      const request = {
        firstName: 'Lara',
        lastName: 'Croft',
        password: 's3cr3tPass',
      } as CreateUserRequest;

      await supertest(app.getHttpServer())
        .post('/user')
        .send(request)
        .expect(400);
    });

    it('throw error when password is too short', async () => {
      const request = {
        firstName: 'Lara',
        lastName: 'Croft',
        email: 'lara@croft.com',
        password: 's3cr3t',
      } as CreateUserRequest;

      await supertest(app.getHttpServer())
        .post('/user')
        .send(request)
        .expect(400);
    });
  });
});
