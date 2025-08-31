"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const sequelize_1 = __importDefault(require("./config/sequelize"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use(index_1.default);
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.default.authenticate();
        console.log('Database connected.');
        if (process.env.NODE_ENV === 'development') {
            yield sequelize_1.default.sync({ alter: true });
            console.log('Database models synchronized.');
        }
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeDatabase();
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server on port ${process.env.PORT || 3000}`);
    });
});
startServer();
exports.default = app;
