const mongoose = require("mongoose")
const { ref } = require("process")

const ledgerSchema = new mongoose.Schema({
  account:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"account",
    required:[true,"ledger must be associated with account"],
    index:true,
    immutable:true
  },
  amount:{
    type:Number,
    required:[true,"amount is required"],
    immutable:true
  },
  type:{
    type:String,
    enum:{
      values:["credit","debit"],
      message:"type can either be credit or debitit", 
    },
    required:[true,"type is required"],
    immutable:true
  },
  transaction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"transaction",
    required:[true,"ledger must be associated with transaction"],
    index:true,
    immutable:true
  }

})

function preventLedgerModification(){
  throw new Error("Ledger entries anr immutabele and it will not change")

}

ledgerSchema.pre("findOneAndDelete",preventLedgerModification)
ledgerSchema.pre("updateOne",preventLedgerModification)
ledgerSchema.pre("deleteMany",preventLedgerModification)
ledgerSchema.pre("remove",preventLedgerModification)
ledgerSchema.pre("deleteOne", preventLedgerModification)

const ledgerModel = mongoose.model("ledger",ledgerSchema)
module.exports = ledgerModel
