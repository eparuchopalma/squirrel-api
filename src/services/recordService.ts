import sequelize from '../config/sequelize';
import recordModel from '../models/recordModel';

const { Record } = sequelize.models;

class RecordService {
  public async read(filters: Partial<recordModel>) {
    const data = await Record!.findAll({
      where: { filters },
      attributes: { exclude: ['user_id'] }
    });
    return data;
  }
}

export default RecordService;