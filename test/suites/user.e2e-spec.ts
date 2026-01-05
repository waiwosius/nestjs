import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { getMainModule } from '../app';
import { TestDatabaseService } from '../services/test-database.service';
import { UserDto } from '../../src/modules/user/user.dto';
import { UserTestService } from '../services/user-test.service';
import { UpdateUserRequest } from '../../src/modules/user/requests/update-user.request';
import { getAccessToken } from '../test-utils';
import { UserRole } from '../../src/modules/user/user-role.enum';
import { PublicUserDto } from '../../src/modules/user/public-user.dto';
import { PageDto } from '../../src/dtos/page.dto';

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
    it('should allow admin to retrieve a list of all users', async () => {
      const user = await userTestService.create();
      await userTestService.create({ email: 'indiana@jones.com' });

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as PageDto<UserDto>;
      expect(result.total).toBe(2);
    });

    it('should allow admin to search user by name', async () => {
      const user = await userTestService.create();
      const user2 = await userTestService.create({
        firstName: 'Indiana',
        email: 'indiana@jones.com',
      });

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get(`/user?limit=1&offset=0&search=${user2.firstName}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as PageDto<UserDto>;
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe(user2.id);
      expect(result.items[0].email).toBe(user2.email);
    });

    it('should forbid non-admin from retrieving all users', async () => {
      const user = await userTestService.create({ role: UserRole.user });

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should allow admin to retrieve a user by ID ', async () => {
      const user = await userTestService.create();

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as UserDto;
      expect(result.email).toBe(user.email);
    });

    it('should throw an error when the user ID does not exist', async () => {
      const user = await userTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .get(`/user/${user.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return currently signed in user', async () => {
      const user = await userTestService.create();

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get(`/user/profile`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as PublicUserDto;
      expect(result.email).toBe(user.email);
    });
  });

  describe('PUT /user', () => {
    it('should allow admin to update the first and last name for a user', async () => {
      const admin = await userTestService.create({
        firstName: 'Unknown',
        lastName: 'Unknown',
      });
      const request = {
        firstName: 'Lara',
        lastName: 'Croft',
        role: admin.role,
      } as UpdateUserRequest;

      const token = await getAccessToken(app, admin.email);
      const response = await supertest(app.getHttpServer())
        .put(`/user/${admin.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as UserDto;
      expect(result.id).toBe(admin.id);
      expect(result.firstName).toBe(request.firstName);
      expect(result.lastName).toBe(request.lastName);
      expect(result.role).toBe(UserRole.admin);
    });

    it('should allow admin to change role of the user', async () => {
      const admin = await userTestService.create();
      const user = await userTestService.create({ role: UserRole.user });
      const request = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: UserRole.admin,
      } as UpdateUserRequest;

      const token = await getAccessToken(app, admin.email);
      const response = await supertest(app.getHttpServer())
        .put(`/user/${user.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as UserDto;
      expect(result.id).toBe(user.id);
      expect(result.firstName).toBe(request.firstName);
      expect(result.lastName).toBe(request.lastName);
      expect(result.role).toBe(UserRole.admin);
    });

    it('should throw an error when the user ID does not exist', async () => {
      const admin = await userTestService.create();
      const request = {
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      } as UpdateUserRequest;

      const token = await getAccessToken(app, admin.email);
      await supertest(app.getHttpServer())
        .put(`/user/${admin.id + 1}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should forbid non-admin from updating user', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      const request = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: UserRole.admin,
      } as UpdateUserRequest;

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .put(`/user/${user.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('DELETE /user', () => {
    it('should allow admin to delete a user', async () => {
      const admin = await userTestService.create();
      const user = await userTestService.create({ role: UserRole.user });

      const token = await getAccessToken(app, admin.email);
      await supertest(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should forbid non-admin from deleting user', async () => {
      const user = await userTestService.create({ role: UserRole.user });

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should throw an error when the user ID does not exist', async () => {
      const admin = await userTestService.create();

      const token = await getAccessToken(app, admin.email);
      await supertest(app.getHttpServer())
        .delete(`/user/${admin.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
