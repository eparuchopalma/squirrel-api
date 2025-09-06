import sequelize from '../config/sequelize';
import recordModel from '../models/recordModel';

const { Record } = sequelize.models;

class RecordService {
  public create(fields: Partial<recordModel>) {
    return Record!.create(fields, { returning: false });
  }

  public read({ user_id, ...filters }: Partial<recordModel>) {
    return Record!.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['date', 'ASC']],
      raw: true,
      where: { ...filters, user_id },
    });
  }

  public update({ id, user_id, ...fields }: Partial<recordModel>) {
    return Record!.update(fields, { where: { id, user_id }})
  }
}

export default RecordService;