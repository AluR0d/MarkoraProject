import {
  Model,
  DataType,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { tableNames } from '../constants/tableNames';
import { Owner } from './Owner';

@Table({ tableName: tableNames.PLACES, timestamps: true })
export class Place extends Model {
  @PrimaryKey
  @Column(DataType.STRING(27))
  id!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  name!: string;

  @Column(DataType.TEXT)
  zone!: string;

  @Column(DataType.TEXT)
  address!: string;

  @Column(DataType.STRING(9))
  phone!: string;

  @Column(DataType.STRING(9))
  second_phone!: string;

  @Column(DataType.ARRAY(DataType.STRING(255)))
  email!: string[];

  @Column(DataType.TEXT)
  website!: string;

  @Column(DataType.TEXT)
  opening_hours!: string;

  @Column(DataType.DECIMAL(2, 1))
  rating!: string;

  @Column(DataType.INTEGER)
  user_ratings_total!: number;

  @Column(DataType.ARRAY(DataType.STRING(255)))
  types!: string[];

  @Default(true)
  @Column(DataType.BOOLEAN)
  active!: boolean;

  @Column(DataType.GEOMETRY('POINT'))
  coords!: { type: 'Point'; coordinates: [number, number] };

  @ForeignKey(() => Owner)
  @Column(DataType.INTEGER)
  owner_id!: number;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  @BelongsTo(() => Owner)
  owner!: Owner;
}
