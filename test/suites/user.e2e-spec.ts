import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { CreateUserRequest } from '../../src/modules/user/requests/create-user.request';
import supertest from 'supertest';
import { User } from '../../src/modules/user/user.entity';

describe('/user', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /user', () => {
    it('POST /user should return a user', async () => {
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

    it('POST /user should return a user then firstName and lastName is not provided', async () => {
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

    it('POST /user throw error when an email is not provided', async () => {
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

    it('POST /user throw error when password is too short', async () => {
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
