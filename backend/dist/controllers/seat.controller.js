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
const uuid_1 = require("uuid");
class SeatController {
    constructor() {
        this.path = '/seat';
        this.router = express.Router();
        this.intializeRoutes = () => {
            this.router.post(`${this.path}/bulkAdd`, this.addSeats);
            this.router.get(`${this.path}/getDetails`, this.fetchSeats);
            this.router.post(`${this.path}/bookSeats`, this.bookSeats);
        };
        //helper function to add seats to coach
        this.addSeats = async (req, res) => {
            try {
                const payload = req.body;
                if (payload) {
                    const capacity = await models_1.default.Coach.findOne({ where: { id: payload.coachId }, attributes: ['capacity'] });
                    if (capacity.dataValues && capacity.dataValues.capacity >= payload.total) {
                        const seats = [];
                        let count = 1;
                        for (let row = 1; row <= 12; row++) {
                            let seatInRow = row === 12 ? 3 : 7;
                            for (let seat = 1; seat <= seatInRow; seat++) {
                                seats.push({
                                    id: (0, uuid_1.v4)(),
                                    coachId: payload.coachId,
                                    row: row,
                                    seatNumber: count
                                });
                                count++;
                            }
                            ;
                        }
                        const result = await models_1.default.Seat.bulkCreate(seats, {
                            returning: true,
                            ignoreDuplicates: true,
                        });
                        res.status(200).send({ data: result, message: 'Seats added in respected coach' });
                    }
                    else {
                        throw 'Coach has insufficient capacity to add seats';
                    }
                }
                else {
                    throw 'Invalid details';
                }
            }
            catch (error) {
                res.status(500).send(error);
            }
        };
        this.fetchSeats = async (req, res) => {
            try {
                const condition = {};
                if (req.query.id) {
                    condition.id = req.query.id;
                }
                if (req.query.coachId) {
                    condition.coachId = Number(req.query.coachId);
                }
                if (req.query.seatNumber) {
                    condition.seatNumber = Number(req.query.seatNumber);
                }
                if (req.query.isBooked) {
                    condition.isBooked = req.query.isBooked;
                }
                const getSeatDetails = await models_1.default.Seat.findAll({
                    where: condition,
                    include: [{
                            model: models_1.default.Coach,
                            attributes: ['id'],
                            include: [models_1.default.Train]
                        }],
                    order: [['seatNumber', 'ASC']]
                });
                res.status(200).send({ data: getSeatDetails, message: 'Seat data fetched successfully' });
            }
            catch (error) {
                res.status(500).send(error);
            }
        };
        this.bookSeats = async (req, res) => {
            try {
                const { seats, coachId } = req.body;
                //check validation for seat booking
                if (!seats || seats <= 0 || seats > 7) {
                    throw { status: 400, message: 'Invalid query for booking, please try again' };
                }
                //find vacant seats in respected coach
                const vacantSeats = await models_1.default.Seat.findAll({
                    where: {
                        coachId: coachId,
                        isBooked: false
                    }
                });
                if (!vacantSeats || vacantSeats.length == 0) {
                    throw { status: 404, message: 'All seats are booked' };
                }
                if (vacantSeats.length < seats) {
                    throw { status: 404, message: `Only ${vacantSeats.length} seats left` };
                }
                const bookedSeats = this.selectSeats(vacantSeats, seats);
                const updateSeats = await models_1.default.Seat.update({
                    isBooked: true,
                }, {
                    where: {
                        seatNumber: bookedSeats,
                        isBooked: false
                    }
                });
                res.status(200).send({ data: bookedSeats, messsage: 'Seats successfully booked' });
            }
            catch (error) {
                res.status(error?.status || 500).send(error?.message || error);
            }
        };
        this.intializeRoutes();
    }
    selectSeats(allSeats, seats) {
        let minGap = Infinity;
        let bestSeats = [];
        let tempSeats = [];
        for (let i = 0; i < allSeats.length; i++) {
            if (!allSeats[i].isBooked) {
                tempSeats.push(allSeats[i].seatNumber);
                if (tempSeats.length == seats) {
                    let gap = this.calculateGap(tempSeats, allSeats);
                    if (gap < minGap) {
                        minGap = gap;
                        bestSeats = [...tempSeats];
                    }
                    // Move the window forward by removing the first element
                    tempSeats.shift();
                }
            }
        }
        return bestSeats;
    }
    calculateGap(seatNumbers, seats) {
        // Calculate the gap between selected seats in the list
        let totalGap = 0;
        for (let i = 0; i < seatNumbers.length - 1; i++) {
            let currentIndex = seats.findIndex((seat) => seat.seatNumber === seatNumbers[i]);
            let nextIndex = seats.findIndex((seat) => seat.seatNumber === seatNumbers[i + 1]);
            totalGap += nextIndex - currentIndex - 1; // Add gaps between seats
        }
        return totalGap;
    }
}
exports.default = SeatController;
//# sourceMappingURL=seat.controller.js.map