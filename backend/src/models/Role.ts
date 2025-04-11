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
import { User } from './User';
import { UserRole } from './UserRole';

@Table({ tableName: tableNames.ROLES, timestamps: true })
export class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  @BelongsToMany(() => User, () => UserRole)
  users!: User[];
}
