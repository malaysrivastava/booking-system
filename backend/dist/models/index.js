"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const train_1 = __importDefault(require("./train"));
const coach_1 = __importDefault(require("./coach"));
const seat_1 = __importDefault(require("./seat"));
const models = { Train: train_1.default, Coach: coach_1.default, Seat: seat_1.default };
exports.default = models;
//# sourceMappingURL=index.js.map