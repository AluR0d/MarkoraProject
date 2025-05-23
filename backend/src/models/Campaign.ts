import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { CampaignPlace } from './CampaignPlace';
import { User } from './User';

@Table({ tableName: 'campaigns', timestamps: false })
export class Campaign extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  message_template!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at!: Date;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active!: boolean;

  @Column(DataType.INTEGER)
  frequency!: number | null;

  @Column(DataType.DATE)
  last_sent_at!: Date | null;

  @HasMany(() => CampaignPlace)
  campaignPlaces!: CampaignPlace[];

  @BelongsTo(() => User)
  user!: User;
}
