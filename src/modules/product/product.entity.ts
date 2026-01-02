import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
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

  @Column({ name: 'number', nullable: true })
  private _number: string;

  get id(): number {
    return this._id;
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  get updatedDate(): Date {
    return this._updatedDate;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get number(): string {
    return this._number;
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
}
