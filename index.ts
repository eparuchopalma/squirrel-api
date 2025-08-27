import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './src/routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(router);

app.listen(port, () => process.env.NODE_ENV === 'development'
  ? console.log(`Server on http://localhost:${port}`)
  : null
);

export default app;
