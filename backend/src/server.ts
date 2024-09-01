import App from './app';
import TrainController from './controllers/train.controller';
import CoachController from './controllers/coach.controller';
import SeatController from './controllers/seat.controller';
require('dotenv').config();

(async ()=>{
    try {
        const app = new App([new TrainController(),new CoachController(),new SeatController()]);

        //start app server
        app.listen(process.env.PORT as string);
    } catch (error) {
        console.log('Error:',error);
    }
})();