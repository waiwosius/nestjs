import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  private _id: number;

  @CreateDateColumn({ name: 'created_date' })
  private _createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
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
  @JoinColumn({ name: 'parent_id', referencedColumnName: '_id' })
  private _parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  @JoinColumn({ name: 'parent_id', referencedColumnName: '_id' })
  private _children: Category[];

  @ManyToMany(() => Product, (product) => product.categories, { cascade: true })
  @JoinTable({ name: 'product_category' })
  private _products: Product[];

  get id(): number {
    return this._id;
  }

  get parentId(): number {
    return this._parentId;
  }

  get parent(): Category {
    return this._parent;
  }

  get children(): Category[] {
    return this._children ? [...this._children] : [];
  }

  get products(): Product[] {
    return this._products ? [...this._products] : [];
  }

  get order(): number {
    return this._order;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
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
