import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PageSerialize } from '../../interceptors/page-serialize.interceptor';
import { ProductSearchRepository } from './product-search.repository';
import { ProductSearchRequest } from './requests/product-search.request';

@Controller('public-product')
export class PublicProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productSearchRepository: ProductSearchRepository,
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
  getOne(@Param('id') productId: number) {
    return this.productService.findOneOrFail(productId);
  }
}
