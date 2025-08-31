"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const sequelize_typescript_1 = require("sequelize-typescript");
const _1 = require(".");
const fundModel_1 = __importDefault(require("../models/fundModel"));
const recordModel_1 = __importDefault(require("../models/recordModel"));
const sequelize = new sequelize_typescript_1.Sequelize(Object.assign(Object.assign({}, _1.dbOptions), { dialect: 'postgres', dialectModule: pg_1.default, logging: console.log, models: [fundModel_1.default, recordModel_1.default] }));
exports.default = sequelize;
