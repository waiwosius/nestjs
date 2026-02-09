import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class Product {
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

  @Column({ name: 'number', nullable: true })
  private _number: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'product_category' })
  private _categories: Category[];

  get id(): number {
    return this._id;
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  get updatedDate(): Date {
    return this._updatedDate;
  }

  get number(): string {
    return this._number;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get categories(): Category[] {
    return this._categories ? [...this._categories] : [];
  }

  setTitle(title: string) {
    this._title = title;
    return this;
  }

  setDescription(description: string) {
    this._description = description;
    return this;
  }

  setNumber(number: string) {
    this._number = number;
    return this;
  }

  setCategories(categories: Category[]) {
    this._categories = categories;
    return this;
  }
}
