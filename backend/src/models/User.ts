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
import { CreationOptional } from 'sequelize';
import { tableNames } from '../constants/tableNames';
import { Role } from './Role';
import { UserRole } from './UserRole';
import { CreateUserDTO } from '../schemas/createUserSchema';

@Table({ tableName: tableNames.USERS, timestamps: true })
export class User extends Model<User, CreateUserDTO> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>;

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
