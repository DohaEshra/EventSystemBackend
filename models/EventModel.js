const mongoose = require("mongoose");


let EventSchema = new mongoose.Schema({
    _id:{type:Number},
    title:{type:String, required:true },
    eventDate:Date,
    MainSpeaker:{type:mongoose.Types.ObjectId, ref:"Speakers"},
    otherSpeakers:{type:[mongoose.Types.ObjectId], ref:"Speakers"},
    students:{type:[Number], ref:"Students"}

})



module.exports= mongoose.model("Events", EventSchema);