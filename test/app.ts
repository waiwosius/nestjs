import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { typeormTestOptions } from './providers/database.provider';
import { TestDatabaseService } from './services/test-database.service';
import { UserTestService } from './services/user-test.service';
import { ProductTestService } from './services/product-test.service';
import { CategoryTestService } from './services/category-test.service';

export const getMainModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [
      TestDatabaseService,
      UserTestService,
      ProductTestService,
      CategoryTestService,
    ],
  })
    .overrideProvider(DataSource)
    .useFactory({
      factory: typeormTestOptions.useFactory,
      inject: typeormTestOptions.inject,
    })
    .compile();
};
