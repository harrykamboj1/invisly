import { model, models, Schema } from "mongoose"

export interface IAlerts{
    userId:string,
    email:string,
    seqNum:string,
    alertName:string,
    companyName:string,
    symbol:string,
    stockIdentifier:string,
    alertCondition:string,
    alertValue:number,
    createdAt?: Date;
}

const alertSchema = new Schema<IAlerts>({
    userId: { type: String, required: true },
    email:{type:String,required:true},
    seqNum:{type:String,required:true},
    alertName: { type:String, required: true },
    symbol:{ type:String, required: true },
    stockIdentifier: { type:String, required: true },
    companyName:{type:String,required:true},
    alertCondition:{type:String,required:true},
    alertValue:{type:Number,required:true},
    createdAt: { type: Date, default: () => new Date() },
})


const AlertsList = models.AlertsList || model<IAlerts>("AlertsList", alertSchema);
export default AlertsList;