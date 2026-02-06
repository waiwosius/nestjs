import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { typeormTestOptions } from './providers/database.provider';
import { TestDatabaseService } from './services/test-database.service';
import { UserTestService } from './services/user-test.service';
import { JwtService } from '@nestjs/jwt';
import { jwtServiceProvider } from './providers/jwt-service.provider';

export const getMainModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [TestDatabaseService, UserTestService],
  })
    .overrideProvider(DataSource)
    .useFactory({
      factory: typeormTestOptions.useFactory,
      inject: typeormTestOptions.inject,
    })
    .overrideProvider(JwtService)
    .useFactory({
      factory: jwtServiceProvider.useFactory,
      inject: jwtServiceProvider.inject,
    })
    .compile();
};
