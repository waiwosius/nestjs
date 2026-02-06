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
    const { title, description, order, parentId } = request;

    const parent = this.categoryRepository.findById(parentId);
    if (!parent) {
      throw new BadRequestException(`Parent category was not found`);
    }

    return this.categoryRepository.save(
      new Category()
        .setTitle(title)
        .setDescription(description)
        .setOrder(order)
        .setParentId(parentId),
    );
  }

  async update(categoryId: number, request: CategoryRequest) {
    const category = await this.findOneOrFail(categoryId);
    const { title, description, order, parentId } = request;

    const parent = this.categoryRepository.findById(parentId);
    if (!parent) {
      throw new BadRequestException(`Parent category was not found`);
    }

    return await this.categoryRepository.save(
      category
        .setTitle(title)
        .setDescription(description)
        .setOrder(order)
        .setParentId(parentId),
    );
  }

  async delete(id: number) {
    const childrenCount = await this.categoryRepository.countByParentId(id);
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete category with children');
    }

    await super.delete(id);
  }
}
