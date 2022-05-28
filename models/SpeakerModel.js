const mongoose = require("mongoose");


let speakerSchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    Email:{type:String,required:true, unique:true},
    UserName:{type:String, required:true},
    password:{type:String, required:true},
    Address:{city:{type:String}, street:{type: String}, building:{type: Number}}
});

module.exports=mongoose.model("Speakers", speakerSchema)