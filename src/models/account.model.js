const mongoose = require("mongoose");
const { ref } = require("process");
const ledgerModel = require("./ledger.model")
const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
      index: true,
    },
    status: {
      type: String,
      emun: {
        values: ["active", "inactive", "closed"],
        message: "account can be active ,incative , closed",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "currency is required to create account"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);
accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function (){
  const balanceData = await ledgerModel.aggregate([
    {$match:{account:this._id}},
    {
      $group:{
        _id:null,
        totalDebit:{
          $sum:{
            $cond :[
              {$eq:["$type","debit"]},
              "$amount",
              0
            ]
          }
        },

        totalCredit:{
          $sum:{
            $cond:[
              {$eq:["$type","credit"]},
              "$amount",
              0
            ]

          }
        }
      },

      $project:{
        _id:0,
        balance:{$subtract:["$totalDebit","$totalCredit"]}
      }
    }
  ])

  if(balanceData.length === 0){
    return 0
  }

  return balanceData[0].balance
}

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
