import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';

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

  findByIds(ids: number[]) {
    return this.repository
      .createQueryBuilder(this.alias)
      .where('id IN (:...ids)', { ids })
      .getMany();
  }

  save(entity: T) {
    return this.repository.save(entity);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  createQueryBuilder(queryRunner?: QueryRunner) {
    return this.repository.createQueryBuilder(this.alias, queryRunner);
  }

  existsBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<boolean> {
    return this.repository.existsBy(where);
  }
}
