import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  Default,
  HasMany
} from 'sequelize-typescript';
import Record from './recordModel';

@Table({ timestamps: false })

class Fund extends Model {
  @Column
  @PrimaryKey
  @Default(DataType.UUIDV4)
  id!: string;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  @Default(0)
  balance!: number;

  @Column({ allowNull: false })
  user_id!: string;

  @Column({ allowNull: false })
  is_main!: boolean;

  @HasMany(() => Record)
  records!: Record[];
}

export default Fund;