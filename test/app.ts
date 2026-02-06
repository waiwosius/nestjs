import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export const getMainModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
  }).compile();
};
