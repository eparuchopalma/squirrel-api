import { Op } from 'sequelize';
import sequelize from '../config/sequelize';
import recordModel from '../models/recordModel';

const { Fund, Record } = sequelize.models;

type PartialRecord = Partial<recordModel>;

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
    if (fields.type !== 1) await testBalance(fields, { includeRecord: fields });
    const transaction = await sequelize.transaction();
    try {
      await Record!.create(fields, { transaction });
      await Fund?.increment({
        balance: Number(fields.amount)
      }, { transaction, where: { id: fields.fund_id } });
      if (fields.type === 0) await Fund?.increment({
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

async function testBalance(
   fundData: PartialRecord,
   options: { exceptID?: string, includeRecord?: PartialRecord, }
 ) {
   const { fund_id, user_id } = fundData;
   const filters = {
     [Op.or]: [{ fund_id }, { correlated_fund_id: fund_id }],
     user_id,
   } as any;
 
   if (options.exceptID) filters.id = { [Op.ne]: options.exceptID };
 
   const fundRecords = await Record!.findAll({
     where: filters,
     raw: true
   }) as PartialRecord[];
 
   if (options.includeRecord) fundRecords.push(options.includeRecord);
 
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

export default RecordService;