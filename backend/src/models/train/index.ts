import sequelize from "../../connection";
import { DataTypes, Model } from "sequelize";
import Coach from "../coach";

export interface ITrain {
    id?:string;
    name:string;
    trainNumber:bigint;
    status?:string;
}

interface TrainInstance extends Model<ITrain>,ITrain {}

const Train = sequelize.define<TrainInstance>(
    'train',
    {
        id:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        trainNumber:{
            type: DataTypes.BIGINT,
            allowNull:false
        },
        status:{
            type:DataTypes.STRING,
            defaultValue:'running'
        }
    }
);


//defining one-to-many relation with coach table
Train.hasMany(Coach,{foreignKey:'trainId'});
Coach.belongsTo(Train,{foreignKey:'trainId'});

//to sync table with any alterations
Train.sync({alter:true}).catch((error:Error)=>{
    console.log(error);
})

export default Train;