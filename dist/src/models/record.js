"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const fund_1 = __importDefault(require("./fund"));
let Record = class Record extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    __metadata("design:type", String)
], Record.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", Date)
], Record.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", Number)
], Record.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", Number)
], Record.prototype, "amount", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Record.prototype, "tag", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Record.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", String)
], Record.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    (0, sequelize_typescript_1.ForeignKey)(() => fund_1.default),
    __metadata("design:type", String)
], Record.prototype, "fund_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => fund_1.default),
    __metadata("design:type", String)
], Record.prototype, "correlated_fund_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => fund_1.default),
    __metadata("design:type", fund_1.default)
], Record.prototype, "fund", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => fund_1.default, 'correlated_fund_id'),
    __metadata("design:type", fund_1.default)
], Record.prototype, "correlatedFund", void 0);
Record = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false })
], Record);
exports.default = Record;
