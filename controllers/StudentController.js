const Student = require("./../models/StudentModel")
const {validationResult} = require("express-validator");
const Events = require("./../models/EventModel")
const mongoose = require("mongoose")
function CheckRole(s)
{
    if(s=="Student")
    {
        return true;
    }
    else{
        throw new Error ("Not Authorized")
    }
}

module.exports.Editprofile=(request, response, next)=>{
    CheckRole(request.body.role)
    let result = validationResult(request); 
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current, error)=>current+error.msg+", "," ");
        let error  = new Error(message);
        error.status = 422;
        throw error;
    }

        Student.findOneAndUpdate({_id:request.id}, {$set:{Email:request.body.email, password:request.body.password}})

    .then(data=>{
        if(data==null)
        {
            throw new Error("Something went wrong in update")
        }
        response.status(200).json({message:"Student updated", data})
    })
    .catch(error=>{
            next(error)
        })
    
}

module.exports.ViewEvents=(request, response, next)=>{
    CheckRole(request.body.role)

    Events.find({students:request.id},{projection: { _id: 0,OtherSpeakers:0, students:0, MainSpeaker:0}})

    .then(data=>{

        response.status(200).json({message:"your Events are: ", data})
    })
    .catch(error=>{
        next(error)
    })
}
