import { Op, Transaction } from 'sequelize';
import sequelize from '../config/sequelize';
import recordModel from '../models/recordModel';

type PartialRecord = Partial<recordModel>;
enum RecordType {
  credit = 1,
  debit = 2,
  fund2fund = 0
};

type TestBalanceArg = {
  fund_id: string,
  includeRecord?: PartialRecord,
  excludeRecord?: PartialRecord,
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
  public async create(payload: PartialRecord) {
    const transaction = await sequelize.transaction();
    try {
      await testDate(payload);

      if (payload.type !== RecordType.credit) await testBalance({
        fund_id: payload.fund_id!,
        includeRecord: payload
      });

      await Record!.create(payload, { transaction });
      await Fund!.increment({
        balance: Number(payload.amount)
      }, { transaction, where: { id: payload.fund_id } });

      if (payload.type === RecordType.fund2fund) await Fund!.increment({
        balance: -Number(payload.amount)
      }, { transaction, where: { id: payload.correlated_fund_id } });

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

  public update(payload: PartialRecord) {
    return Record!.update(payload, { where: { id: payload.id }, returning: false });;
  }

}

async function testDate(record: PartialRecord) {
  const isFuture = new Date(record.date!) > new Date();
  if (isFuture) throw new Error('The record date cannot be in the future.');
  const isTaken = await Record!.count({
    where: { date: record.date, user_id: record.user_id },
  });
  if (isTaken) throw new Error('There is already a record at the given date.');
  return;
}

async function testBalance({ fund_id, includeRecord, excludeRecord }: TestBalanceArg) {
  const filters: any = {
    [Op.or]: [{ fund_id }, { correlated_fund_id: fund_id }],
    id: { [Op.ne]: excludeRecord || null }
  };
  const fundRecords = await getRecords(filters) as (recordModel | PartialRecord)[];

  if (includeRecord) fundRecords.push(includeRecord);
  fundRecords.sort((a, b) => new Date(a.date!) > new Date(b.date!) ? 1 : -1);

  fundRecords.reduce((balance, r) => {
    const recordSumsToFund = r.fund_id === fund_id;
    const result = balance + (recordSumsToFund ? Number(r.amount) : -Number(r.amount));
    if (result < 0) throw new Error('The record would cause inconsistencies.' +
      `\nOn ${formatDate(r.date!)}, `+
      `fund's balance (${fixAmount(balance)}) ` +
      `couldn't cover the amount of ${fixAmount(r.amount!)}.`
    );
    return result;
  }, 0);
  return;
}

function getRecords(filters: any) {
  return Record!.findAll({ where: filters, raw: true });
}

export default RecordService;