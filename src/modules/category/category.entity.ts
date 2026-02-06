import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  private _id: number;

  @Column({ name: 'created_date' })
  private _createdDate: Date;

  @Column({ name: 'updated_date' })
  private _updatedDate: Date;

  @Column({ name: 'title', nullable: true })
  private _title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  private _description: string;

  @Column({ name: 'order', nullable: true, default: 0 })
  private _order: number;

  @Column({ name: 'parent_id', nullable: true })
  private _parentId: number;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @ManyToMany(() => Product, (product) => product.categories, { cascade: true })
  @JoinTable({ name: 'product_category' })
  products: Product[];

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get order(): number {
    return this._order;
  }

  get parentId(): number {
    return this._parentId;
  }

  setTitle(title: string) {
    this._title = title;
    return this;
  }

  setDescription(description: string) {
    this._description = description;
    return this;
  }

  setOrder(order: number) {
    this._order = order;
    return this;
  }

  setParentId(id: number) {
    this._parentId = id;
    return this;
  }
}
