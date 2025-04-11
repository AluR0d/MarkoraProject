import {
  Model,
  DataType,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import { tableNames } from '../constants/tableNames';
import { User } from './User';
import { Role } from './Role';

@Table({
  tableName: tableNames.USERS_ROLES,
  timestamps: false,
})
export class UserRole extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @PrimaryKey
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  role_id!: number;
}
