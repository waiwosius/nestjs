import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';

@Entity()
export class ProductCategory {
  @PrimaryColumn({ name: 'category_id' })
  private _categoryId: number;

  @PrimaryColumn({ name: 'product_id' })
  private _productId: number;

  @ManyToOne(() => Product, (product) => product.categories)
  @JoinColumn({ name: 'product_id', referencedColumnName: '_id' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: '_id' })
  category: Category;

  get productId(): number {
    return this._productId;
  }

  get categoryId(): number {
    return this._categoryId;
  }

  setProductId(productId: number) {
    this._productId = productId;
    return this;
  }

  setCategoryId(categoryId: number) {
    this._categoryId = categoryId;
    return this;
  }
}
