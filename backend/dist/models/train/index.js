"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../connection"));
const sequelize_1 = require("sequelize");
const coach_1 = __importDefault(require("../coach"));
const Train = connection_1.default.define('train', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    trainNumber: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'running'
    }
});
//defining one-to-many relation with coach table
Train.hasMany(coach_1.default, { foreignKey: 'trainId' });
coach_1.default.belongsTo(Train, { foreignKey: 'trainId' });
//to sync table with any alterations
Train.sync({ alter: true }).catch((error) => {
    console.log(error);
});
exports.default = Train;
//# sourceMappingURL=index.js.map