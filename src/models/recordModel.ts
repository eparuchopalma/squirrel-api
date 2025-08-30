import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  Default,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';
import Fund from './fundModel';
  
@Table({ timestamps: false })
  
class Record extends Model {
  @Column
  @PrimaryKey
  @Default(DataType.UUIDV4)
  id!: string;

  @Column({ allowNull: false })
  date!: Date;

  @Column({ allowNull: false })
  type!: number;

  @Column({ allowNull: false })
  amount!: number;

  @Column
  tag?: string;

  @Column
  note?: string;

  @Column({ allowNull: false })
  user_id!: string;

  @Column({ allowNull: false })
  @ForeignKey(() => Fund)
  fund_id!: string;

  @Column
  @ForeignKey(() => Fund)
  correlated_fund_id?: string;

  @BelongsTo(() => Fund)
  fund!: Fund;

  @BelongsTo(() => Fund, 'correlated_fund_id')
  correlatedFund?: Fund;
}

export default Record;