import sequelize from "../../connection";
import { DataTypes, Model } from "sequelize";

export interface ISeat {
    id?:string;
    coachId:number;
    row:number;
    seatNumber:number;
    isBooked?:boolean
}

interface SeatInstance extends Model<ISeat>,ISeat {}

const Seat = sequelize.define<SeatInstance>(
    'seat',
    {
        id:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        coachId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        row:{
            type: DataTypes.BIGINT,
            allowNull:false
        },
        seatNumber:{
            type: DataTypes.BIGINT,
            allowNull:false
        },
        isBooked:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
    },
      { 
        indexes:[
            {
                fields:['coachId','seatNumber']
            }
       ]
    }
);

//to sync table with any alterations
Seat.sync({alter:true}).catch((error)=>{
    console.log(error);
})

export default Seat;