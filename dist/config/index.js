"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbOptions = exports.environment = void 0;
exports.environment = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${exports.environment}` });
exports.dbOptions = {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
};
