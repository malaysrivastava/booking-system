import Controller from "../interfaces/controller.interface";
import * as express from 'express';
import {Request,Response} from 'express';
import { ICoach } from "../models/coach";
import models from "../models";

class CoachController implements Controller {
    public path = '/coach';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes = () => {
        this.router.post(
            `${this.path}/addCoach`,
            this.addCoach
        );
        this.router.get(
            `${this.path}/getDetails`,
            this.fetchCoach
        );
    }
    //helper function to add new coach
    private addCoach = async (req:Request,res:Response) => {
        try {
           const payload:ICoach = req.body;
           if(payload){
             const addData = await models.Coach.create(payload);
             res.status(200).send({data:addData,message:'Coach added successfully'});
           } else {
            throw 'Invalid details';
           }
        } catch (error) {
            res.status(500).send(error);
        }
       
    }

    private fetchCoach = async (req:Request,res:Response) => {
        try {
            
            const condition:{id?:string;trainId?:string;type?:string} = {type:'passenger'};
            if(req.query.id){
                condition.id = req.query.id as string
            }
            if(req.query.trainId){
                condition.trainId = req.query.trainId as string
            }
            if(req.query.type){
                condition.type = req.query.type as string;
            }
              const getTrainDetails = await models.Train.findAll({
                where:condition,
                include:[models.Train]
              })
              res.status(200).send({data:getTrainDetails,message:'Coach data fetched successfully'});
            
         } catch (error) {
             res.status(500).send(error);
         }
        
    }
}

export default CoachController;