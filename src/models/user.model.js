// const { match } = require("assert");
// const { time, timeStamp } = require("console");
const mongoose = require("mongoose");
// const { type } = require("os");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already taken"],
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
    lowercase: true,
  },
  name:{
    type: String,
    required: [true, "name is required"],
    trim: true,
    minlength: [3, "name should be alteast 3 characters long"],
    maxlength: [30, "name can not be more than 30 characters long"]
  },
  password:{
    type:String,
    required: [true,"password is required"],
    minlength: [6, "password should be alteast 6 characters long"],
    select:false
  }
},{
  timeStamp: true
}
);

userSchema.pre("save",async function (){
  if(!this.isModified("password")){
    return 
  }
  const hash = await bcrypt.hash(this.password, 10 )
  this.password = hash

  return 
})


userSchema.methods.comparePassword = async function (password) {

  return await bcrypt.compare(password, this.password).catch(e=>console.log(e))  
}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel


