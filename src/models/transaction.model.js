const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  fromAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"account",
    required: [true,"Transaction must be associate with from account"],
    index:true
  },
  toAccount:{
        type: mongoose.Schema.Types.ObjectId,
    ref:"account",
    required: [true,"Transaction must be associate with TO account"],
    index:true
  },
  status:{
    type:String,
    enum:{
      values:["pending","completed","failed","reversed"],
      message:"Status can either be pendding,completed,failed or reversed"

    }
    ,
    default:"pending"
  },
  amount:{
    type:Number,
    required:[true,"Amount is required"],
    min:[0.01,"Amount must be greater than 0.01"]
  },
  idempotencyKey:{
    type:String,
    unique:true,
    index:true,
    required:[true,"idempotencyKey is required"]
  }
}, {
  timeStamp:true
})

const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports = transactionModel