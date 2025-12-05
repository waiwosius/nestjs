import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CreateUserRequest } from '../../src/modules/user/requests/create-user.request';
import supertest from 'supertest';
import { User } from '../../src/modules/user/user.entity';
import { getMainModule } from '../app';

describe('/user', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getMainModule();
    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
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

      const result = response.body as User;
      expect(result.firstName).toBe(request.firstName);
      expect(result.lastName).toBe(request.lastName);
      expect(result.email).toBe(request.email);
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

      const result = response.body as User;
      expect(result.firstName).toBeUndefined();
      expect(result.lastName).toBeUndefined();
      expect(result.email).toBe(request.email);
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
