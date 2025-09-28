import { ValidationError, EmptyResultError, Op, Transaction } from 'sequelize';
import sequelize from '../config/sequelize';
import recordModel from '../models/recordModel';
import fundModel from '../models/fundModel';

type Payload = Partial<recordModel>;

enum RecordType {
  credit = 1,
  debit = 2,
  fund2fund = 0
};

const { Fund, Record } = sequelize.models;

class RecordService {
  public async create(payload: Payload) {
    const { amount, correlated_fund_id, date, fund_id, type, user_id } = payload;
    checkAmount(payload);
    checkCorrelatedFund(payload);
    const transaction = await sequelize.transaction();
    try {
      await testDate(date!, user_id!);
      await validateFunds(payload);
      if (type !== RecordType.credit) await testBalance(fund_id!, payload);

      await Record!.create(payload, { transaction });
      await Fund!.increment({
        balance: amount
      }, { where: { id: fund_id, user_id }, transaction });

      if (type === RecordType.fund2fund) await Fund!.increment({
        balance: -Number(amount)
      }, { transaction, where: { id: correlated_fund_id, user_id }});

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return;
  }

  public async destroy(payload: Payload) {
    const record = await Record!.findByPk(payload.id);
    if (!record) throw new EmptyResultError('Record not found.');
    const transaction = await sequelize.transaction();
    try {
      const { amount, correlated_fund_id, fund_id, type } = record.dataValues;
      if (type === RecordType.credit) {
        await testBalance(fund_id, record.dataValues, false);
      } else if (type === RecordType.fund2fund) {
        await testBalance(correlated_fund_id, record.dataValues, false);
        await Fund!.increment({ balance: amount}, {
        where: {
          id: record.dataValues.correlated_fund_id,
          user_id: payload.user_id
        }, transaction });
      }
      await Fund!.increment({ balance: -Number(amount)}, {
        where: {
          id: record.dataValues.fund_id,
          user_id: payload.user_id
        }, transaction });
      await record.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  public read(payload: Payload) {
    return Record!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['date', 'ASC']],
      raw: true,
      where: payload,
    });
  }

  public async update(payload: Payload) {
    const recordStored = await Record!.findOne({
      where: { id: payload.id, user_id: payload.user_id }
    }) as recordModel;
    if (!recordStored) throw new EmptyResultError('Record not found.');

    const updateKeys = getUpdateKeys(recordStored.dataValues, payload);
    if (updateKeys.length === 0) throw new ValidationError('Nothing to update.', []);

    const textKeys = ['note', 'tag'];
    const onlyTextKeys = updateKeys.every(key => textKeys.includes(key));

    if (onlyTextKeys) return recordStored.update(payload, { returning: false });
    if (payload.date) await testDate(payload.date, recordStored.dataValues.user_id!);
    if (payload.fund_id || payload.correlated_fund_id) await validateFunds(payload);

    const recordEdited = { ...recordStored.dataValues, ...payload };

    checkAmount(recordEdited);
    checkCorrelatedFund(recordEdited);

    const transaction = await sequelize.transaction();

    try {
      await handleBalanceUpdate(recordStored, recordEdited, transaction);
      await recordStored.update(payload, { returning: false, transaction });
      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
    return;
  }

}

function formatDate(date: Date) {
  return new Date(date).toUTCString();
}

function fixAmount(amount: number) {
  return Number(amount).toFixed(2);
}

async function testDate(date: Date, user_id: string) {
  checkFutureDate(date);
  await checkDateIsFree({ date, user_id });
}

function checkAmount(payload: Payload) {
  if (payload.type === RecordType.credit && Number(payload.amount) <= 0) {
    throw new ValidationError('Amount must be positive for credit.', []);
  } else if (payload.type !== RecordType.credit && Number(payload.amount) >= 0) {
    throw new ValidationError('Amount must be negative for debit and fund2fund.', []);
  }
}

function checkCorrelatedFund(payload: Payload) {
  if (payload.type === RecordType.fund2fund && !payload.correlated_fund_id) {
    throw new ValidationError('A correlated fund is required for fund2fund.', []);
  } else if (payload.type !== RecordType.fund2fund && payload.correlated_fund_id) {
    throw new ValidationError('Correlated fund is only allowed for fund2fund.', []);
  } else if (payload.fund_id === payload.correlated_fund_id) {
    throw new ValidationError('Funds cannot be equal.', []);
  }
  return;
}

function checkFutureDate(date: Date) {
  if (new Date(date) > new Date()) {
    throw new ValidationError('Date cannot be in future.', []);
  } else return;
}

async function checkDateIsFree({ date, user_id }: { date: Date, user_id: string }) {
  const recordOnDate = await Record!.findOne({ where: { date, user_id } });
  if (recordOnDate) throw new ValidationError('Date already taken.', []);
}

function handleBalanceUpdate(
  original: recordModel,
  payload: recordModel,
  transaction: Transaction
) {
  const fundsToUpdate = [original.fund_id];

  if (original.correlated_fund_id) fundsToUpdate.push(original.correlated_fund_id);
  if (!fundsToUpdate.includes(payload.fund_id)) fundsToUpdate.push(payload.fund_id);
  if (payload.correlated_fund_id && !fundsToUpdate.includes(payload.correlated_fund_id)) {
    fundsToUpdate.push(payload.correlated_fund_id);
  }

  return Promise.all(Array.from(fundsToUpdate, (fund_id: string) => {
    return updateFundBalance(fund_id, original, payload, transaction)
  }));
}

async function updateFundBalance(
  fund_id: string,
  original: recordModel,
  payload: recordModel,
  transaction: Transaction
) {
  const originalAmountOnFund = getRecordEffectOnFund(fund_id, original);
  const payloadAmountOnFund = getRecordEffectOnFund(fund_id, payload);
  const payloadDateIsNewer = new Date(payload.date) > new Date(original.date);
  const payloadDiff = -Number(originalAmountOnFund) + Number(payloadAmountOnFund);
  const payloadDecrements = payloadDiff < 0;

  if (payloadDecrements || payloadDateIsNewer) await testBalance(fund_id, payload);

  if (payloadDiff !== 0) return Fund!.increment({
    balance: payloadDiff
  }, { where: { id: fund_id }, transaction });

  return;
}

function getRecordEffectOnFund(fund_id: string, record: recordModel) {
  if (fund_id === record.fund_id) return record.amount;
  else if (fund_id === record.correlated_fund_id) return -Number(record.amount);
  else return 0;
}

async function testBalance(fund_id: string, payload: Payload, includingPayload = true) {
  const fundRecords = await getFundRecords(fund_id, payload.id) as Payload[];
  const payloadIsRelated = [payload.fund_id, payload.correlated_fund_id]
    .includes(fund_id);

  if (includingPayload && payloadIsRelated) fundRecords.push(payload);

  fundRecords.sort((a, b) => new Date(a.date!) > new Date(b.date!) ? 1 : -1);

  const balance = fundRecords.reduce((balance, r) => {
    const receivesFromFund = fund_id === r.correlated_fund_id;
    const result = balance + (receivesFromFund ? -Number(r.amount) : Number(r.amount));

    if (result < 0) {
      const message = `\nOn ${formatDate(r.date!)}, ` +
        `fund's balance (${fixAmount(balance)}) ` +
        `couldn't cover the amount of ${fixAmount(r.amount!)}.`;
      throw new ValidationError(message, []);
    }

    return result;
  }, 0);
  return balance;
}

function getUpdateKeys(recordStored: recordModel, payload: Payload) {
  return Object
    .keys(payload)
    .filter((key) => {
      const k = key as keyof Payload;
      let notEqual;
      if (k === 'amount') notEqual = Number(recordStored[k]) !== Number(payload[k]);
      else if (k === 'date') notEqual = recordStored[k]
        .toISOString() !== (new Date(payload[k]!) as Date).toISOString();
      else notEqual = recordStored[k] !== payload[k];
      if (!notEqual) delete payload[k];
      return notEqual;
    });
}

function getFundRecords(fund_id: string, exceptID?: string) {
  const filters: any = { [Op.or]: [{ fund_id }, { correlated_fund_id: fund_id }] };
  if (exceptID) filters.id = { [Op.ne]: exceptID };
  return Record!.findAll({ where: filters, raw: true });
}

async function validateFunds(payload: Payload) {
  const fund = await Fund!.findOne({
    where: { id: payload.fund_id, user_id: payload.user_id },
    raw: true
  }) as fundModel | null;

  if (!fund) throw new EmptyResultError('Fund not found.');

  if (payload.type === RecordType.credit && !fund.is_main) throw new ValidationError(
    'Credits are only allowed on main funds.', []);

  if (payload.type === RecordType.fund2fund) {
    const correlatedFund = await Fund!.findOne({
      where: { id: payload.correlated_fund_id, user_id: payload.user_id },
      raw: true
    }) as fundModel | null;
    if (!correlatedFund) throw new EmptyResultError('Correlated fund not found.');
  }

  return;
}

export default RecordService;