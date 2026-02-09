import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/user-role.enum';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { ProductRequest } from './requests/product.request';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PageSerialize } from '../../interceptors/page-serialize.interceptor';
import { ProductSearchRepository } from './product-search.repository';
import { ProductSearchRequest } from './requests/product-search.request';
import { CategoryService } from '../category/category.service';
import { ProductCategoryService } from '../product-category/product-category.service';

@Roles(UserRole.admin)
@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productSearchRepository: ProductSearchRepository,
    private readonly categoryService: CategoryService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @PageSerialize(ProductDto)
  @Get()
  async search(@Query() query: ProductSearchRequest) {
    const { limit, offset, search } = query;

    const [products, total] = await this.productSearchRepository.search({
      limit,
      offset,
      search,
    });

    return {
      items: products,
      total,
      limit,
      offset,
    };
  }

  @Serialize(ProductDto)
  @Get(':id')
  async getOne(@Param('id') productId: number) {
    const product = await this.productService.findOneOrFail(productId);
    const categoriesIds =
      await this.productCategoryService.findCategoryIdsByProductId(productId);
    const categories = await this.categoryService.findByIds(categoriesIds);

    return product.setCategories(categories);
  }

  @Serialize(ProductDto)
  @Post()
  async create(@Body() body: ProductRequest) {
    return await this.productService.create(body);
  }

  @Serialize(ProductDto)
  @Put(':id')
  async update(@Param('id') productId: number, @Body() body: ProductRequest) {
    return await this.productService.update(productId, body);
  }

  @Serialize(ProductDto)
  @Delete(':id')
  delete(@Param('id') productId: number) {
    return this.productService.delete(productId);
  }
}
