import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/user-role.enum';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { ProductRequest } from './requests/product.request';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { Serialize } from '../../interseptors/serialize.interceptor';

@Roles(UserRole.admin)
@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Serialize(ProductDto)
  @Get(':id')
  getOne(@Param('id') productId: number) {
    return this.productService.findOneOrFail(productId);
  }

  @Serialize(ProductDto)
  @Post()
  create(@Body() body: ProductRequest) {
    return this.productService.create(body);
  }

  @Serialize(ProductDto)
  @Put(':id')
  update(@Param('id') productId: number, @Body() body: ProductRequest) {
    return this.productService.update(productId, body);
  }

  @Serialize(ProductDto)
  @Delete(':id')
  delete(@Param('id') productId: number) {
    return this.productService.delete(productId);
  }
}
