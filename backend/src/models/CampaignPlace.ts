import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Campaign } from './Campaign';
import { Place } from './Place';

@Table({ tableName: 'campaign_places', timestamps: false })
export class CampaignPlace extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Campaign)
  @Column(DataType.INTEGER)
  campaign_id!: number;

  @ForeignKey(() => Place)
  @Column(DataType.STRING)
  place_id!: string;

  @Column({
    type: DataType.ENUM('PENDING', 'SENT'),
    defaultValue: 'PENDING',
  })
  status!: 'PENDING' | 'SENT';

  @Column(DataType.DATE)
  sent_at?: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  send_count!: number;

  @BelongsTo(() => Campaign)
  campaign!: Campaign;

  @BelongsTo(() => Place)
  place!: Place;
}
