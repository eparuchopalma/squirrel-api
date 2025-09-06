import sequelize from '../config/sequelize';
import fundModel from '../models/fundModel';

const { Fund } = sequelize.models;

class FundService {
  public create(fields: Partial<fundModel>) {
    return Fund!.create(fields, { returning: false });
  }

  public read({ user_id }: Partial<fundModel>) {
    return Fund!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['name', 'ASC']],
      raw: true,
      where: { user_id },
    })
  }

  public update({ id, user_id, ...fields }: Partial<fundModel>) {
    return Fund!.update(fields, { where: { id, user_id } });
  }
}

export default FundService;