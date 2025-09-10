import { Op, Transaction } from 'sequelize';
import sequelize from '../config/sequelize';
import recordModel from '../models/recordModel';

type PartialRecord = Partial<recordModel>;
enum RecordType {
  credit = 1,
  debit = 2,
  fund2fund = 0
};

const { Fund, Record } = sequelize.models;

function formatDate (date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium', timeStyle: 'medium'
  }).format(new Date(date));
}

function fixAmount(amount: number) {
  return Number(amount).toFixed(2);
}

class RecordService {
  public async create(fields: PartialRecord) {
    const transaction = await sequelize.transaction();
    try {
      await validateDate(fields, transaction);
      await validateBalance(fields, { transaction});
      await Record!.create(fields, { transaction });
      await Fund!.increment({
        balance: Number(fields.amount)
      }, { transaction, where: { id: fields.fund_id } });

      if (fields.type === RecordType.fund2fund) await Fund!.increment({
        balance: -Number(fields.amount)
      }, { transaction, where: { id: fields.correlated_fund_id } });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return transaction.commit();
  }

  public read({ user_id, ...filters }: PartialRecord) {
    return Record!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['date', 'ASC']],
      raw: true,
      where: { ...filters, user_id },
    });
  }

  public update({ id, user_id, ...fields }: PartialRecord) {
    return Record!.update(fields, { where: { id, user_id }})
  }

}

async function validateBalance(
  record: PartialRecord,
  options?: {
    excludeID?: string,
    transaction?: Transaction
  }
) {
  const { fund_id, user_id, type } = record;
  const filters = {
    [Op.or]: [{ fund_id }, { correlated_fund_id: fund_id }],
    user_id,
  } as any;

  if (options?.excludeID) filters.id = { [Op.ne]: options.excludeID };

  const fundRecords = await Record!.findAll({
    where: filters,
    raw: true,
    transaction: options?.transaction,
  }) as PartialRecord[];

  if (type !== RecordType.credit) fundRecords.push(record);

  fundRecords.sort((a, b) => new Date(a.date!) > new Date(b.date!) ? 1 : -1);

  fundRecords.reduce((acc, record) => {
    const increases = record.fund_id === fund_id;
    const total = acc + (increases ? Number(record.amount) : -Number(record.amount));
    if (total < 0) throw new Error('The record would cause inconsistencies.' +
      `\nOn ${formatDate(record.date!)}, `+
      `fund's balance (${fixAmount(acc)}) ` +
      `couldn't cover the amount of ${fixAmount(record.amount!)}.`
    );
    return total;
  }, 0);

  return;
}

async function validateDate(record: PartialRecord, transaction: Transaction) {
  const isFuture = new Date(record.date!) > new Date();
  if (isFuture) throw new Error('The record date cannot be in the future.');
  const isTaken = await Record!.count({
    where: { date: record.date, user_id: record.user_id },
    transaction
  });
  if (isTaken) throw new Error('There is already a record at the given date.');
  return;
}

export default RecordService;