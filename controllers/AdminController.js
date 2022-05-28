
const {validationResult} = require("express-validator")

//Models
const Events = require("./../models/EventModel")
const Speakers = require("./../models/SpeakerModel")
const Students = require("./../models/StudentModel")

function CheckRole(s)
{
    if(s=="Admin")
    {
        return true;
    }
    else{
        throw new Error ("Not Authorized")
    }
}

module.exports.ViewSpeakers = (request, response, next)=>{
    CheckRole(request.body.role)
    Speakers.find()
    .then(data=>response.status(200).json({message:"All speakers", data}))
    .catch(err=>next(err))
}
module.exports.ViewStudents = (request, response, next)=>{
    CheckRole(request.body.role)
    Students.find()
    .then(data=>response.status(200).json({message:"All Students", data}))
    .catch(err=>next(err))
}

module.exports.AddEvent = (request, response, next)=>{
    CheckRole(request.body.role)

    let result = validationResult(request)
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current, error)=>current+error.msg+", ", " ")
        let err = new Error(message);
        err.status = 422;
        throw err;
    }
    let event = new Events({
        _id:request.body.id,
        title:request.body.title,
        eventDate:request.body.Date,
        MainSpeaker:request.body.MainSpeaker,
        otherSpeakers:request.body.OtherSpeakers,
        students:request.body.students
    })
    event.save()
    .then(data=>{
        response.status(200).json({message:"Event added", data})
    })
    .catch(error=>next(error))
}
module.exports.EditEvent = (request, response, next)=>{ 
    CheckRole(request.body.role)

    let result = validationResult(request);
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current, error)=>current+error.msg+", "," ");
        let error  = new Error(message);
        error.status = 422;
        throw error;
        
    }   
        Events.findOneAndUpdate({_id:request.body.id},{
            title:request.body.title,
            eventDate:request.body.Date,
            MainSpeaker:request.body.MainSpeaker,
            otherSpeakers:request.body.OtherSpeakers,
            students:request.body.students
        },{new:true})

    .then(data=>{

        response.status(200).json({message:"Event updated", data})
    })
    .catch(error=>{
        next(error)
    })
    
}
module.exports.DeleteEvent = (request, response, next)=>{
    CheckRole(request.query.role)
    console.log(request)

        Events.findByIdAndDelete({_id:request.query.id})
        .then(data=>{
            console.log(data)
        response.status(200).json({message:"Event deleted", data})
    })
    .catch(error=>{
        next(error)
    })
}

module.exports.AddSpeakersORStudents = (request, response, next)=>{
    console.log(request);
    CheckRole(request.body.role)
    if(request.body.addspeaker==null)
    {
        
            Events.updateOne({_id:request.body.Eventid},{$addToSet:{students:request.body.addstudent}})
            .then(data=>
                response.status(200).json({message:"Student Added", data}))
            .catch(error=>next(error))
    }
    if(request.body.addstudent==null)
    {
        Events.updateOne({_id:request.body.Eventid},{$addToSet:{otherSpeakers:request.body.addspeaker}})
            .then(data=>
                response.status(200).json({message:"Speaker Added", data}))
            .catch(error=>next(error))
    }
}

module.exports.EditPeople = (request, response, next)=>{
    CheckRole(request.body.role)
    console.log(request)
    if(request.body.Editrole=="Speaker")
    {
        Speakers.updateOne({UserName: request.body.username},{$set:{Email:request.body.Email,Address:{city:request.body.Address.city, street:request.body.Address.street, building: request.body.Address.building}}})
        .then(data=>response.status(200).json({message:"Student updated", data}))
        .catch(error=>next(error))
    }
    else if(request.body.Editrole=="Student")
    {
        Students.updateOne({Email:request.body.Email},{$set:{Email:request.body.NewEmail}})
        .then(data=>response.status(200).json({message:"Student updated", data}))
        .catch(error=>next(error))
    }
}

module.exports.DeletePeople=(request, response, next)=>{
    console.log(request)
    CheckRole(request.query.role)
    if(request.query.Deleterole=="Speaker")
    {
        Speakers.deleteOne({Email:request.query.Email})
        .then(data=>response.status(200).json({message:"Speaker deleted by Admin"}, data))
        .catch(error=>next(error))
    }
    else if(request.query.Deleterole=="Student")
    {
        Students.deleteOne({Email:request.query.Email})
        .then(data=>response.status(200).json({message:"Student deleted by Admin"}, data))
        .catch(error=>next(error))
    }
}
