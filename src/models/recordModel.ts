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
  
@Table({ tableName: 'records', timestamps: false })

  class Record extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id!: string;

  @Column({ allowNull: false })
  amount!: number;

  @ForeignKey(() => Fund)
  @Column
  correlated_fund_id?: string;

  @Column({ allowNull: false })
  date!: Date;

  @ForeignKey(() => Fund)
  @Column({ allowNull: false })
  fund_id!: string;

  @Column
  note?: string;

  @Column
  tag?: string;

  @Column({ allowNull: false })
  type!: number;

  @Column({ allowNull: false })
  user_id!: string;

  @BelongsTo(() => Fund)
  fund!: Fund;

  @BelongsTo(() => Fund, 'correlated_fund_id')
  correlatedFund?: Fund;
}
  export default Record;