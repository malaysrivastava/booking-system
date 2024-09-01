import sequelize from "../../connection";
import Seat from "../seat";
import { DataTypes, Model } from "sequelize";

export interface ICoach {
    id?:number;
    trainId:string;
    capacity:number;
    type?:string;
}

interface CoachInstance extends Model<ICoach>,ICoach {}

const Coach = sequelize.define<CoachInstance>(
    'coach',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        trainId:{
            type: DataTypes.STRING,
            allowNull:false
        },
        capacity:{
            type: DataTypes.BIGINT,
            allowNull:false
        },
        type:{
            type:DataTypes.STRING,
            defaultValue:'passenger'
        }
    }
);

//defining one-to-many relation with seat table
Coach.hasMany(Seat,{foreignKey:'coachId'});
Seat.belongsTo(Coach,{foreignKey:'coachId'});

//to sync table with any alterations
Coach.sync({alter:true}).catch((error)=>{
    console.log(error);
})


export default Coach;