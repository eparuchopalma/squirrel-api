import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index';
import errorHandler from './middleware/errorHandler';
import sequelize from './config/sequelize';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(router);
app.use(errorHandler);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const startServer = async () => {
  await initializeDatabase();
  app.listen(process.env.PORT || 3000, () => console.log(`Up on port ${process.env.PORT || 3000}`));
};

startServer();

export default app;
