import Controller from "../interfaces/controller.interface";
import * as express from 'express';
import {Request,Response} from 'express';
import {ISeat} from '../models/seat';
import models from "../models";
import {v4} from 'uuid';

class SeatController implements Controller {
    public path = '/seat';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes = () => {
        this.router.post(
            `${this.path}/bulkAdd`,
            this.addSeats
        );
        this.router.get(
            `${this.path}/getDetails`,
            this.fetchSeats
        );
        this.router.post(
            `${this.path}/bookSeats`,
            this.bookSeats
        );
        
    }
    //helper function to add seats to coach
    private addSeats = async (req:Request,res:Response) => {
        try {
           const payload:{coachId:number,total:number} = req.body;
           if(payload){
             const capacity = await models.Coach.findOne({where:{id:payload.coachId},attributes:['capacity']});
             if(capacity.dataValues && capacity.dataValues.capacity >= payload.total){

                const seats:Array<ISeat> = [];
                let count = 1;
                for (let row = 1; row <= 12; row++) {
                let seatInRow = row === 12 ? 3 : 7;
                for (let seat = 1; seat <= seatInRow; seat++) {
                    seats.push({
                    id:v4(),
                    coachId:payload.coachId,
                    row:row,
                    seatNumber:count
                    });
                    count++;
                };
              }

              const result = await models.Seat.bulkCreate(seats, {
                  returning: true,
                  ignoreDuplicates: true, 
              });
              res.status(200).send({data:result,message:'Seats added in respected coach'});

             } else {
                throw 'Coach has insufficient capacity to add seats';
             }
            
           } else {
            throw 'Invalid details';
           }
        } catch (error) {
            res.status(500).send(error);
        }
       
    }

    private fetchSeats = async (req:Request,res:Response) => {
        try {
            
            const condition:{id?:string;coachId?:number;seatNumber?:number;isBooked?:boolean} = {};
            if(req.query.id){
                condition.id = req.query.id as string
            }
            if(req.query.coachId){
                condition.coachId = Number(req.query.coachId) 
            }
            if(req.query.seatNumber){
                condition.seatNumber = Number(req.query.seatNumber) 
            }
            if(req.query.isBooked){
                condition.isBooked = req.query.isBooked as any;
            }
              const getSeatDetails = await models.Seat.findAll({
                where:condition,
                include:[{
                    model:models.Coach,
                    attributes:['id'],
                    include:[models.Train]
                }],
                order: [['seatNumber', 'ASC']] 
              });
              res.status(200).send({data:getSeatDetails,message:'Seat data fetched successfully'});
            
         } catch (error) {
             res.status(500).send(error);
         }
        
    }

    private bookSeats = async (req:Request,res:Response) => {
        try {
            const {seats,coachId} = req.body;
        //check validation for seat booking
        if(!seats || seats <=0 || seats > 7){
            throw {status:400,message:'Invalid query for booking, please try again'};
        }
        //find vacant seats in respected coach
        const vacantSeats = await models.Seat.findAll({
            where:{
                coachId:coachId,
                isBooked:false
            }
        });
        if(!vacantSeats || vacantSeats.length == 0){
            throw {status:404,message:'All seats are booked'}
        }
        if(vacantSeats.length < seats){
            throw {status:404,message:`Only ${vacantSeats.length} seats left`}
        }
        const bookedSeats:Array<number> = this.selectSeats(vacantSeats,seats);
        const updateSeats = await models.Seat.update(
            {
                isBooked:true,
            },
            {
                where : {
                    seatNumber : bookedSeats,
                    isBooked: false
                }
            }
          );
        res.status(200).send({data:bookedSeats,messsage:'Seats successfully booked'})
        } catch (error) {
            res.status(error?.status || 500).send(error?.message || error);
        }
    }

    private selectSeats(allSeats:Array<ISeat>, seats:number):null | Array<number> {
        let minGap = Infinity;
        let bestSeats:any = [];
        let tempSeats:any = [];
      
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

    private calculateGap(seatNumbers:Array<number>, seats:Array<ISeat>) {
        // Calculate the gap between selected seats in the list
        let totalGap = 0;
      
        for (let i = 0; i < seatNumbers.length - 1; i++) {
          let currentIndex = seats.findIndex((seat:ISeat) => seat.seatNumber === seatNumbers[i]);
          let nextIndex = seats.findIndex((seat:ISeat) => seat.seatNumber === seatNumbers[i + 1]);
          totalGap += nextIndex - currentIndex - 1; // Add gaps between seats
        }
      
        return totalGap;
      }
      

}

export default SeatController;