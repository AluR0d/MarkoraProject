import {
  Model,
  DataType,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { tableNames } from '../constants/tableNames';
import { Role } from './Role';
import { UserRole } from './UserRole';

@Table({ tableName: tableNames.USERS, timestamps: true })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  password!: string;

  readonly createdAt?: Date | null;
  readonly updatedAt?: Date | null;

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];
}
