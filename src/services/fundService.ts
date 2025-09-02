import sequelize from '../config/sequelize';
import fundModel from '../models/fundModel';

const { Fund } = sequelize.models;

class FundService {
  public read({ user_id }: Partial<fundModel>) {
    return Fund!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['name', 'ASC']],
      raw: true,
      where: { user_id },
    })
  }
}

export default FundService;