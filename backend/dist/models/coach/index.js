"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../connection"));
const seat_1 = __importDefault(require("../seat"));
const sequelize_1 = require("sequelize");
const Coach = connection_1.default.define('coach', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trainId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'passenger'
    }
});
//defining one-to-many relation with seat table
Coach.hasMany(seat_1.default, { foreignKey: 'coachId' });
seat_1.default.belongsTo(Coach, { foreignKey: 'coachId' });
//to sync table with any alterations
Coach.sync({ alter: true }).catch((error) => {
    console.log(error);
});
exports.default = Coach;
//# sourceMappingURL=index.js.map