import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
    book_id:{type:mongoose.Schema.Types.ObjectId,ref:"Book"},
    issued_date:{type:Date,required:true,default:Date.now},
    return_date:{type:Date,required:true,default:null},
    fine:{type:Number,default:0}
    

});

export default mongoose.model("Transaction",transactionSchema);