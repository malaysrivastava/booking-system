"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const train_controller_1 = __importDefault(require("./controllers/train.controller"));
const coach_controller_1 = __importDefault(require("./controllers/coach.controller"));
const seat_controller_1 = __importDefault(require("./controllers/seat.controller"));
require('dotenv').config();
(async () => {
    try {
        const app = new app_1.default([new train_controller_1.default(), new coach_controller_1.default(), new seat_controller_1.default()]);
        //start app server
        app.listen(process.env.PORT);
    }
    catch (error) {
        console.log('Error:', error);
    }
})();
//# sourceMappingURL=server.js.map