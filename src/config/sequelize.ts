import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { dbOptions } from '.';

const sequelize = new Sequelize({
  ...dbOptions,
  dialect: 'postgres',
  dialectModule: pg,
  models: [__dirname + '/models'],
  logging: console.log
});

export default sequelize;