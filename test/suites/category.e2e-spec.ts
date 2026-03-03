import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TestDatabaseService } from '../services/test-database.service';
import { getMainModule } from '../app';
import { UserRole } from '../../src/modules/user/user-role.enum';
import { getAccessToken } from '../test-utils';
import { UserTestService } from '../services/user-test.service';
import supertest from 'supertest';
import { CategoryTestService } from '../services/category-test.service';
import { CategoryDto } from '../../src/modules/category/category.dto';
import { CategoryRequest } from '../../src/modules/category/requests/category.request';

describe('/category', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabaseService: TestDatabaseService;
  let userTestService: UserTestService;
  let categoryTestService: CategoryTestService;

  beforeAll(async () => {
    module = await getMainModule();
    testDatabaseService = module.get<TestDatabaseService>(TestDatabaseService);
    userTestService = module.get<UserTestService>(UserTestService);
    categoryTestService = module.get<CategoryTestService>(CategoryTestService);

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

  describe('GET /category', () => {
    it('should allow admin to retrieve a list of all categories', async () => {
      const user = await userTestService.create();
      await categoryTestService.create();
      await categoryTestService.create();

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get('/category')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as CategoryDto[];
      expect(result.length).toBe(2);
    });

    it('should forbid non-admin from retrieve a list of all categories', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      await categoryTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .get('/category')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('GET /category/:id', () => {
    it('should allow admin to retrieve a category by ID', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get(`/category/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as CategoryDto;
      expect(result.id).toBe(category.id);
      expect(result.title).toBe(category.title);
      expect(result.description).toBe(category.description);
      expect(result.order).toBe(category.order);
      expect(result.parentId).toBe(category.parentId);
    });

    it('should throw an error when the category ID does not exist', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .get(`/category/${category.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('POST /category/', () => {
    it('should allow admin to create a category', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();
      const request = {
        title: 'New Category',
        description: 'New category description',
        order: 1,
        parentId: category.id,
      } as CategoryRequest;

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .post(`/category/`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const result = response.body as CategoryDto;
      expect(result.id).toBeDefined();
      expect(result.title).toBe(request.title);
      expect(result.description).toBe(request.description);
      expect(result.order).toBe(request.order);
      expect(result.parentId).toBe(request.parentId);
    });

    it('should forbid non-admin from creating a category', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      const request = {
        title: 'New Category',
        description: 'New category description',
        order: 1,
        parentId: null,
      } as CategoryRequest;

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .post(`/category/`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('PUT /category/:id', () => {
    it('should allow admin to update a category', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();
      const request = {
        title: 'Updated Category',
        description: 'Updated Category description',
        order: 1,
        parentId: null,
      } as CategoryRequest;

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .put(`/category/${category.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as CategoryDto;
      expect(result.id).toBe(category.id);
      expect(result.title).toBe(request.title);
      expect(result.description).toBe(request.description);
      expect(result.order).toBe(request.order);
      expect(result.parentId).toBe(request.parentId);
    });

    it('should forbid updating a category when the request is invalid', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();
      const request = {
        title: 'Updated Category',
      };
      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .put(`/category/${category.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('should forbid non-admin from updating a category', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      const category = await categoryTestService.create();
      const request = {
        title: 'Updated Category',
        description: 'Updated Category description',
        order: 1,
        parentId: null,
      } as CategoryRequest;

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .put(`/category/${category.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('DELETE /category/:id', () => {
    it('should allow admin to delete a category', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .delete(`/category/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should throw an error when the category ID does not exist', async () => {
      const user = await userTestService.create();
      const category = await categoryTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .delete(`/category/${category.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PATCH /category/:firstId/change-order/:secondId', () => {
    it('should be able to change order', async () => {
      const user = await userTestService.create();
      const firstParent = await categoryTestService.create();
      const secondParent = await categoryTestService.create();
      const firstCategory = await categoryTestService.create({
        parentId: firstParent.id,
        order: 1,
      });
      const secondCategory = await categoryTestService.create({
        parentId: secondParent.id,
        order: 2,
      });

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .patch(
          `/category/${firstCategory.id}/change-order/${secondCategory.id}`,
        )
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const firstCategoryResult = await categoryTestService
        .repository()
        .createQueryBuilder('category')
        .where('id = :id', { id: firstCategory.id })
        .getOne();

      expect(firstCategoryResult.parentId).toBe(secondParent.id);
      expect(firstCategoryResult.order).toBe(2);

      const secondCategoryResult = await categoryTestService
        .repository()
        .createQueryBuilder('category')
        .where('id = :id', { id: secondCategory.id })
        .getOne();

      expect(secondCategoryResult.parentId).toBe(secondParent.id);
      expect(secondCategoryResult.order).toBe(1);
    });
  });
});
