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
  HasMany,
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';
import { tableNames } from '../constants/tableNames';
import { Role } from './Role';
import { UserRole } from './UserRole';
import { CreateUserDTO } from '../schemas/User/createUserSchema';
import { Campaign } from './Campaign';

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

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 100 })
  balance!: number;

  readonly createdAt?: Date | null;
  readonly updatedAt?: Date | null;

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];

  @HasMany(() => Campaign)
  campaigns!: Campaign[];
}
