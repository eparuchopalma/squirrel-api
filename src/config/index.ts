export const environment = (process.env.NODE_ENV || 'development') as 'production' | 'development';

require('dotenv').config({ path: `.env.${environment}`});

export const port = process.env.PORT || 3000;