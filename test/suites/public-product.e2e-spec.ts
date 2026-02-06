import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TestDatabaseService } from '../services/test-database.service';
import { getMainModule } from '../app';
import { ProductTestService } from '../services/product-test.service';
import { UserRole } from '../../src/modules/user/user-role.enum';
import { getAccessToken } from '../test-utils';
import { UserTestService } from '../services/user-test.service';
import supertest from 'supertest';
import { ProductDto } from '../../src/modules/product/product.dto';
import { PageDto } from '../../src/dtos/page.dto';

describe('/public-product', () => {
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

  describe('GET /public-product', () => {
    it('should allow non-admin to retrieve a list of all products', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      await productTestService.create();
      await productTestService.create();

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get('/public-product')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as PageDto<ProductDto>;
      expect(result.total).toBe(2);
    });

    it('should allow non-admin to search product by title', async () => {
      const user = await userTestService.create({ role: UserRole.user });
      const product = await productTestService.create({ title: 'Title' });

      const token = await getAccessToken(app, user.email);
      const response = await supertest(app.getHttpServer())
        .get(`/public-product?limit=1&offset=0&search=${product.title}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body as PageDto<ProductDto>;
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe(product.id);
      expect(result.items[0].title).toBe(product.title);
    });
  });
});
