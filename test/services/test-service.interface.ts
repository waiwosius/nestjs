import { Repository } from 'typeorm';

export interface TestServiceInterface {
  create: (params: Partial<unknown>) => unknown;
  fixture: (params: Partial<unknown>) => unknown;
  repository: () => Repository<unknown>;
}
