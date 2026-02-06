import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TestDatabaseService } from '../services/test-database.service';
import { getMainModule } from '../app';
import { ProductTestService } from '../services/product-test.service';
import { ProductRequest } from '../../src/modules/product/requests/product.request';
import { UserRole } from '../../src/modules/user/user-role.enum';
import { getAccessToken } from '../test-utils';
import { UserTestService } from '../services/user-test.service';
import supertest from 'supertest';
import { ProductDto } from '../../src/modules/product/product.dto';

describe('/product', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabaseService: TestDatabaseService;
  let userTestService: UserTestService;
  let productTestService: ProductTestService;

  beforeAll(async () => {
    module = await getMainModule();
    testDatabaseService = module.get<TestDatabaseService>(TestDatabaseService);
    userTestService = module.get<UserTestService>(UserTestService);
    productTestService = module.get<ProductTestService>(ProductTestService);

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

  describe('GET /product/:id', () => {
    it('should return a product by ID', async () => {
      const user = await userTestService.create();
      const product = await productTestService.create();

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get(`/product/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as ProductDto;
      expect(result.id).toBe(product.id);
      expect(result.title).toBe(product.title);
      expect(result.description).toBe(product.description);
      expect(result.number).toBe(product.number);
    });

    it('should throw an error when the product ID does not exist', async () => {
      const user = await userTestService.create();
      const product = await productTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .get(`/user/${product.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('POST /product/', () => {
    it('should allow admin to create a product', async () => {
      const user = await userTestService.create();
      const request = {
        title: 'New Product',
        description: 'New Product description',
        number: '123b',
      } as ProductRequest;

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .post(`/product/`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const result = response.body as ProductDto;
      expect(result.id).toBeDefined();
      expect(result.title).toBe(request.title);
      expect(result.description).toBe(request.description);
      expect(result.number).toBe(request.number);
    });

    it('should forbid non-admin from creating a product', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      const request = {
        title: 'New Product',
        description: 'New Product description',
        number: '123b',
      } as ProductRequest;

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .post(`/product/`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('PUT /product/:id', () => {
    it('should allow admin to update a product', async () => {
      const user = await userTestService.create();
      const product = await productTestService.create();
      const request = {
        title: 'Updated Product',
        description: 'Updated Product description',
        number: product.number,
      } as ProductRequest;

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .put(`/product/${product.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as ProductDto;
      expect(result.id).toBe(product.id);
      expect(result.title).toBe(request.title);
      expect(result.description).toBe(request.description);
      expect(result.number).toBe(request.number);
    });

    it('should forbid updating a product when the request is invalid', async () => {
      const user = await userTestService.create();
      const product = await productTestService.create();
      const request = {
        title: 'Updated Product',
        description: 'Updated Product description',
      };
      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .put(`/product/${product.id}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('should forbid non-admin from updating a product', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      const product = await productTestService.create();
      const request = {
        title: 'Updated Product',
        description: 'Updated Product description',
        number: product.number,
      } as ProductRequest;

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .put(`/product/${product.id + 1}`)
        .send(request)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('DELETE /product/:id', () => {
    it('should allow admin to delete a product', async () => {
      const user = await userTestService.create();
      const product = await productTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .delete(`/product/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should throw an error when the product ID does not exist', async () => {
      const user = await userTestService.create();
      const product = await productTestService.create();

      const token = await getAccessToken(app, user.email);
      await supertest(app.getHttpServer())
        .delete(`/product/${product.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
