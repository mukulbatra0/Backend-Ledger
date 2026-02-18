const mongoose = require("mongoose");
const { ref } = require("process");
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
const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
