import sequelize from '../config/sequelize';

const { Record } = sequelize.models;

class RecordService {
  public async read(user_id: string) {
    const data = await Record?.findAll({
      where: { user_id },
      attributes: { exclude: ['user_id'] }
    });
    return data;
  }
}

export default RecordService;