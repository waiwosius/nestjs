import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { getMainModule } from '../app';
import { TestDatabaseService } from '../services/test-database.service';
import { UserDto } from '../../src/modules/user/user.dto';
import { UserTestService } from '../services/user-test.service';
import { UpdateUserRequest } from '../../src/modules/user/requests/update-user.request';

describe('/user', () => {
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

  describe('GET /user', () => {
    it('should return a list of all users', async () => {
      await userTestService.create();
      await userTestService.create({ email: 'indiana@jones.com' });
      const response = await supertest(app.getHttpServer())
        .get('/user')
        .expect(200);

      const result = response.body as UserDto[];
      expect(result.length).toBe(2);
    });

    it('should return a user by ID', async () => {
      const user = await userTestService.create();
      const response = await supertest(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(200);

      const result = response.body as UserDto;
      expect(result.email).toBe(user.email);
    });

    it('should throw an error when the user ID does not exist', async () => {
      const user = await userTestService.create();
      await supertest(app.getHttpServer())
        .get(`/user/${user.id + 1}`)
        .expect(404);
    });
  });

  describe('PUT /user', () => {
    it('should update the first and last name for a user', async () => {
      const user = await userTestService.create({
        firstName: 'Unknown',
        lastName: 'Unknown',
      });
      const request = {
        firstName: 'Lara',
        lastName: 'Croft',
      } as UpdateUserRequest;

      const response = await supertest(app.getHttpServer())
        .put(`/user/${user.id}`)
        .send(request)
        .expect(200);

      const result = response.body as UserDto;
      expect(result.firstName).toBe(request.firstName);
      expect(result.lastName).toBe(request.lastName);
    });

    it('should remove the first name of a user', async () => {
      const user = await userTestService.create();
      const request = {
        lastName: 'Croft',
      } as UpdateUserRequest;

      const response = await supertest(app.getHttpServer())
        .put(`/user/${user.id}`)
        .send(request)
        .expect(200);

      const result = response.body as UserDto;
      expect(result.firstName).toBeUndefined();
      expect(result.lastName).toBe(request.lastName);
    });

    it('should remove the first and last name of the user', async () => {
      const user = await userTestService.create();

      const response = await supertest(app.getHttpServer())
        .put(`/user/${user.id}`)
        .send({})
        .expect(200);
      const result = response.body as UserDto;
      expect(result.firstName).toBeUndefined();
      expect(result.lastName).toBeUndefined();
    });

    it('should throw an error when the user ID does not exist', async () => {
      const user = await userTestService.create();
      await supertest(app.getHttpServer())
        .put(`/user/${user.id + 1}`)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /user', () => {
    it('should delete a user', async () => {
      const user = await userTestService.create();
      await supertest(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .expect(200);
    });

    it('should throw an error when the user ID does not exist', async () => {
      const user = await userTestService.create();
      await supertest(app.getHttpServer())
        .delete(`/user/${user.id + 1}`)
        .expect(404);
    });
  });
});
