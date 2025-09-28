import { EmptyResultError, Transaction, ValidationError, Op } from 'sequelize';
import sequelize from '../config/sequelize';
import fundModel from '../models/fundModel';
import recordModel from '../models/recordModel';

const { Fund, Record } = sequelize.models;

type Payload = Partial<fundModel>;

class FundService {
  public create(payload: Payload) {
    return Fund!.create(payload, { returning: false });
  }

  public async destroy({ id, user_id }: Payload) {
    const fund = await Fund!.findOne({ where: { id, user_id } });
    if (!fund) throw new EmptyResultError('Fund not found');
    if (fund.dataValues.is_main) throw new ValidationError(
      'Main fund cannot be deleted', []);

    const mainFund = await Fund!.findOne({ where: { user_id, is_main: true }});
    if (!mainFund) throw new EmptyResultError('Main fund not found');

    const transaction = await sequelize.transaction();
    try {
      const fund_id = fund.dataValues.id;
      const mainFundID = mainFund.dataValues.id;
      await deleteNonConflictingRecords(fund_id, mainFundID, transaction);
      await reassignRecords(fund_id, mainFundID, transaction);
      await updateFundBalance(mainFundID, transaction);
      await fund.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    } 
  }

  public read({ user_id }: Payload) {
    return Fund!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['name', 'ASC']],
      raw: true,
      where: { user_id },
    })
  }

  public async update({ id, user_id, ...fields }: Payload) {
    const fund = await Fund!.findOne({ where: { id, user_id } });
    if (!fund) throw new EmptyResultError('Fund not found');
    else return fund.update(fields);
  }
}

async function reassignRecords(
  fund_id: string,
  mainFundID: string,
  transaction: Transaction
) {
  await Record!.update({ fund_id: mainFundID }, { where: { fund_id }, transaction });
  await Record!.update({
    correlated_fund_id: mainFundID
  }, { where: { correlated_fund_id: fund_id }, transaction, });
  return;
}

async function deleteNonConflictingRecords(
  fund_id: string,
  mainFundID: string,
  transaction: Transaction
) {
  return await Record!.destroy({
    where: {
      fund_id: {
        [Op.or]: [fund_id, mainFundID]
      },
      correlated_fund_id: {
        [Op.or]: [fund_id, mainFundID]
      }
    },
    transaction,
  });
}

async function updateFundBalance(fund_id: string, transaction: Transaction) {
  const records = await Record!.findAll({
    where: { [Op.or]: [{ fund_id }, { correlated_fund_id: fund_id }] },
    raw: true,
    transaction
  }) as recordModel[];

  records.sort((a, b) => new Date(a.date!) > new Date(b.date!) ? 1 : -1);
  const balance = records.reduce((balance, r) => {
    const receivesFromFund = fund_id === r.correlated_fund_id;
    const result = balance + (receivesFromFund ? -Number(r.amount) : Number(r.amount));
    return result;
  }, 0);

  return await Fund!.update({ balance }, { where: { id: fund_id }, transaction });
}

export default FundService;