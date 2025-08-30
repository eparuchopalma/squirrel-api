"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
exports.environment = (process.env.NODE_ENV || 'development');
require('dotenv').config({ path: `.env.${exports.environment}` });
