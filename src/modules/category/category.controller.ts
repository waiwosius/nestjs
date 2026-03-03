import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/user-role.enum';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CategoryRequest } from './requests/category.request';
import { CategoryDto } from './category.dto';

@Roles(UserRole.admin)
@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Serialize(CategoryDto)
  @Get()
  async getAll() {
    return await this.categoryService.findAll();
  }

  @Serialize(CategoryDto)
  @Get(':id')
  async get(@Param('id') categoryId: number) {
    return await this.categoryService.findOneOrFail(categoryId);
  }

  @Serialize(CategoryDto)
  @Post()
  async create(@Body() body: CategoryRequest) {
    return this.categoryService.create(body);
  }

  @Serialize(CategoryDto)
  @Put(':id')
  async update(@Param('id') categoryId: number, @Body() body: CategoryRequest) {
    return this.categoryService.update(categoryId, body);
  }

  @Delete(':id')
  async delete(@Param('id') categoryId: number) {
    const category = await this.categoryService.findOneOrFail(categoryId);

    await this.categoryService.delete(category.id);
  }

  @Patch(':firstId/change-order/:secondId')
  async changeOrder(
    @Param('firstId') firstId: number,
    @Param('secondId') secondId: number,
  ) {
    const [firstCategory, secondCategory] = await Promise.all([
      this.categoryService.findOneOrFail(firstId),
      this.categoryService.findOneOrFail(secondId),
    ]);

    await this.categoryService.changeOrder(firstCategory, secondCategory);
  }
}
