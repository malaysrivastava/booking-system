import Controller from "../interfaces/controller.interface";
import * as express from 'express';
import {Request,Response} from 'express';
import { ITrain } from "../models/train";
import models from "../models";
import {v4} from 'uuid'

class TrainController implements Controller {
    public path = '/train';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes = () => {
        this.router.post(
            `${this.path}/addTrain`,
            this.addTrain
        );
        this.router.get(
            `${this.path}/getDetails`,
            this.fetchTrain
        );
    }
    //helper function to add new train
    private addTrain = async (req:Request,res:Response) => {
        try {
           const payload:ITrain = req.body;
           if(payload){
             payload.id = v4();
             const addData = await models.Train.create(payload);
             res.status(200).send({data:addData,message:'Train added successfully'});
           } else {
            throw 'Invalid details';
           }
        } catch (error) {
            res.status(500).send(error);
        }
       
    }

    private fetchTrain = async (req:Request,res:Response) => {
        try {
            
            const condition:{id?:string;name?:string;trainNumber?:number;status?:string} = {status:'running'};
            if(req.query.id){
                condition.id = req.query.id as string
            }
            if(req.query.name){
                condition.name = req.query.name as string
            }
            if(req.query.trainNumber){
                condition.trainNumber = Number(req.query.trainNumber);
            }
            if(req.query.status){
                condition.status = req.query.status as string
            }
              const getTrainDetails = await models.Train.findAll({
                where:condition,
                include:[{model:models.Coach,attributes:['id']}]
              })
              res.status(200).send({data:getTrainDetails,message:'Train data fetched successfully'});
            
         } catch (error) {
             res.status(500).send(error);
         }
        
    }
}
export default TrainController;