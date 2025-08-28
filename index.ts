import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './src/routes';
import { port } from './src/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(router);

app.listen(port);

export default app;
