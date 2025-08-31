"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordRouter_1 = __importDefault(require("./recordRouter"));
const router = express_1.default.Router();
router.use('/record', recordRouter_1.default);
router.use('/', (req, res) => res.send('Hello_World'));
exports.default = router;
