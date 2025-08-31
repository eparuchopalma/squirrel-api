import dotenv from 'dotenv'

console.log(process.env.NODE_ENV)

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development' }` });

export default {
  database: process.env.DB_NAME,
  dialect: 'postgres',
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
  }
};