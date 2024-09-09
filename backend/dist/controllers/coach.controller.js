"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const models_1 = __importDefault(require("../models"));
class CoachController {
    constructor() {
        this.path = '/coach';
        this.router = express.Router();
        this.intializeRoutes = () => {
            this.router.post(`${this.path}/addCoach`, this.addCoach);
            this.router.get(`${this.path}/getDetails`, this.fetchCoach);
        };
        //helper function to add new coach
        this.addCoach = async (req, res) => {
            try {
                const payload = req.body;
                if (payload) {
                    const addData = await models_1.default.Coach.create(payload);
                    res.status(200).send({ data: addData, message: 'Coach added successfully' });
                }
                else {
                    throw 'Invalid details';
                }
            }
            catch (error) {
                res.status(500).send(error);
            }
        };
        this.fetchCoach = async (req, res) => {
            try {
                const condition = { type: 'passenger' };
                if (req.query.id) {
                    condition.id = req.query.id;
                }
                if (req.query.trainId) {
                    condition.trainId = req.query.trainId;
                }
                if (req.query.type) {
                    condition.type = req.query.type;
                }
                const getTrainDetails = await models_1.default.Train.findAll({
                    where: condition,
                    include: [models_1.default.Train]
                });
                res.status(200).send({ data: getTrainDetails, message: 'Coach data fetched successfully' });
            }
            catch (error) {
                res.status(500).send(error);
            }
        };
        this.intializeRoutes();
    }
}
exports.default = CoachController;
//# sourceMappingURL=coach.controller.js.map