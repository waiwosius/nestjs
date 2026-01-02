import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  private _id: number;

  @CreateDateColumn({ name: 'created_date' })
  private _createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  private _updatedDate: Date;

  @Column({ name: 'first_name', nullable: true })
  private _firstName: string;

  @Column({ name: 'last_name', nullable: true })
  private _lastName: string;

  @Column({ name: 'email' })
  private _email: string;

  @Column({ name: 'password' })
  private _password: string;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 50,
    default: UserRole.user,
  })
  private _role: UserRole;

  get id(): number {
    return this._id;
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  get updatedDate(): Date {
    return this._updatedDate;
  }
  get firstName(): string {
    return this._firstName;
  }
  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  setFirstName(firstName: string) {
    this._firstName = firstName;
    return this;
  }

  setLastName(lastName: string) {
    this._lastName = lastName;
    return this;
  }

  setEmail(email: string) {
    this._email = email;
    return this;
  }

  setPassword(password: string) {
    this._password = password;
    return this;
  }

  setRole(role: UserRole) {
    this._role = role;
    return this;
  }
}
