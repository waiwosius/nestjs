import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { typeormTestOptions } from './database.provider';
import { TestDatabaseService } from './test-database.service';

export const getMainModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [TestDatabaseService],
  })
    .overrideProvider(DataSource)
    .useFactory({
      factory: typeormTestOptions.useFactory,
      inject: typeormTestOptions.inject,
    })
    .compile();
};
