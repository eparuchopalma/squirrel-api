import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(router);

app.listen(process.env.PORT || 3000);

export default app;
