import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractEntityService } from '../../common/abstract-entity.service';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CategoryRequest } from './requests/category.request';

@Injectable()
export class CategoryService extends AbstractEntityService<Category> {
  constructor(private readonly categoryRepository: CategoryRepository) {
    super(categoryRepository, 'Category');
  }

  findAll() {
    return this.categoryRepository.findAll();
  }

  create(request: CategoryRequest) {
    return this.save(new Category(), request);
  }

  async update(categoryId: number, request: CategoryRequest) {
    const category = await this.findOneOrFail(categoryId);
    return this.save(category, request);
  }

  async delete(id: number) {
    const childrenCount = await this.categoryRepository.countByParentId(id);
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete category with children');
    }

    await super.delete(id);
  }

  private save(
    category: Category,
    { parentId, order, title, description }: CategoryRequest,
  ) {
    return this.categoryRepository.save(
      category
        .setParentId(parentId || null)
        .setOrder(order)
        .setTitle(title)
        .setDescription(description),
    );
  }
}
