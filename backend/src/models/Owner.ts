import {
  Model,
  DataType,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { tableNames } from '../constants/tableNames';
import { Place } from './Place';

@Table({ tableName: tableNames.OWNERS, timestamps: true })
export class Owner extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: string;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  @HasMany(() => Place)
  places!: Place[];
}
