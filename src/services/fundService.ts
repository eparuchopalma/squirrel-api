import sequelize from '../config/sequelize';
import fundModel from '../models/fundModel';

const { Fund } = sequelize.models;

class FundService {
  public read(filters: Partial<fundModel>) {
    return Fund!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['name', 'ASC']],
      raw: true,
      where: filters,
    })
  }
}

export default FundService;