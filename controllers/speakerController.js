const {validationResult} = require("express-validator");
const mongoose  = require("mongoose");
const Speaker = require("./../models/SpeakerModel");
const Events = require("./../models/EventModel");

function CheckRole(s)
{
    if(s=="Speaker")
    {
        return true;
    }
    else{
        throw new Error ("Not Authorized")
    }
}


module.exports.updateProfile=(request, response, next)=>{
    CheckRole(request.body.role)

    let result = validationResult(request);
    if(!result.isEmpty())
    {
        //during development
        let message = result.array().reduce((current, error)=>current+error.msg+", "," ");
        let error  = new Error(message);
        error.status = 422;
        throw error;
    }
    Speaker.findOneAndUpdate({_id:request.id},{ $set: {Email: request.body.Email, UserName: request.body.userName, password:request.body.password, Address:{city:request.body.Address.city, street:request.body.Address.street, building: request.body.Address.building}} })

    .then((data)=>{
        if(data.matchedCount==0)
        throw new Error("Speaker doesnt exist")

        data.save();
        response.status(200).json({message:"Profile updated", data});
        })
        .catch(error=>next(error))
}
module.exports.viewEvents=(request, response, next)=>{
    CheckRole(request.body.role)

    Events.find({otherSpeakers:request.id})
    .then(data=>response.status(200).json({message:" your events are:", data}))
    .catch(error=> next(error))
    
}
//later
module.exports.DeclineEvent=(request, response, next)=>{

    response.status(200).json({message:"decline event"});
}