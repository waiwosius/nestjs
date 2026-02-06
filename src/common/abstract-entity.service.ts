import { NotFoundException } from '@nestjs/common';
import { AbstractRepositoryService } from './abstract-repository.service';

export abstract class AbstractEntityService<T> {
  protected constructor(
    private readonly repository: AbstractRepositoryService<T>,
    private readonly entityName: string,
  ) {}

  /**
   * Finds an entity by ID or throws a NotFoundException.
   *
   * @param id
   */
  async findOneOrFail(id: number): Promise<T> {
    const entity = await this.repository.findById(id);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return entity;
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
  }
}
