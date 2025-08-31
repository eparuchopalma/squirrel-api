import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { dbOptions } from '.';
import Fund from '../models/fundModel';
import Record from '../models/recordModel';

const sequelize = new Sequelize({
  ...dbOptions,
  dialect: 'postgres',
  dialectModule: pg,
  logging: console.log,
  models: [Fund, Record]
});

export default sequelize;