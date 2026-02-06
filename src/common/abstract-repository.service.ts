import { Repository } from 'typeorm';

export abstract class AbstractRepositoryService<T> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly alias: string,
  ) {}

  /**
   * Finds an entity by ID.
   *
   * @param id
   */
  findById(id: number) {
    return this.repository
      .createQueryBuilder(this.alias)
      .where('id = :id', { id })
      .getOne();
  }

  save(entity: T) {
    return this.repository.save(entity);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
