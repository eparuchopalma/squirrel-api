export const environment = process.env.NODE_ENV || 'development' as 'production' | 'development';

require('dotenv').config({ path: `.env.${environment}`});

export const dbOptions = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
};
