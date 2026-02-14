const { CONNREFUSED } = require("dns");
const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log("error while connecting to DB", err.message);
      process.exit(1);
    });
}

module.exports = connectToDB;
