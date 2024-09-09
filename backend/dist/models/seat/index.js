"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../connection"));
const sequelize_1 = require("sequelize");
const Seat = connection_1.default.define('seat', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    coachId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    row: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    seatNumber: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    isBooked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    indexes: [
        {
            fields: ['coachId', 'seatNumber']
        }
    ]
});
//to sync table with any alterations
Seat.sync({ alter: true }).catch((error) => {
    console.log(error);
});
exports.default = Seat;
//# sourceMappingURL=index.js.map