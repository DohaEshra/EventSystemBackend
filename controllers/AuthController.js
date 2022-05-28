
const {validationResult} = require("express-validator");
const mongoose  = require("mongoose");
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
//schemas
const Student = require("./../models/StudentModel")
const Speaker = require("./../models/SpeakerModel")

// const speakerRoute = require("./../routers/speakerRouter");
// const studentRoute = require("./../routers/studentRouter");


module.exports.login=(request, response, next)=>{
    let token;
    //admin
    console.log("I'm in login")
    if(request.body.email=="DohaAdmin"&& request.body.password==1234)
    {
        token= JWT.sign({role:"Admin", email:"DohaAdmin"},
        "MySecretKey",{expiresIn:"1h"})
    response.status(200).json({message:"Login successeded", token})

    }
    else if(request.body.role=="Student"){
        
        Student.findOne({Email:request.body.email})
        .then(data=>{
            if(data==null)
            throw new Error("User doesnt exist")
            
            Student.findOne({Email:request.body.email}, function(err, user){
                if(err)
                {
                    next(err)
                }
                else if(user){
                    bcrypt.compare(request.body.password, user.password,function(err, res){//compare passes
                        if(err)
                        {
                            console.log("error happened",err)
                        }
                        else if(res) {
                            token=JWT.sign({_id:data._id,
                                        Email:data.email,
                                        role:"Student"},
                                        "MySecretKey", 
                                        {expiresIn:"1h"});

                            response.json({Message:user, token})
                        }
                        else if(!res)
                        {

                                next(new Error("incorrect password "))
                        }
                    } )
                }

            })
        })
        .then(data=>{

        }).catch(error=>next(error))

    }

    else if(request.body.role=="Speaker")
    {
        console.log("Speaker Auth")
        Speaker.findOne({Email:request.body.email,password:request.body.password})
        .then(data=>{
            if(data==null)
            throw new Error("userName and password incorrect");
            
            token = JWT.sign({_id:data._id, Email:data.email, role:"Speaker"}, "MySecretKey", {expiresIn:"1h"});
            response.status(200).json({message:"logged in successfully", token})
        })
        .catch(error=>next(error))
    }

}
module.exports.registerStudent=(request, response, next)=>{
    let token;
    let result = validationResult(request);

    if(!result.isEmpty())
    {

        let message = result.array().reduce((current, error)=>current+error.msg+", "," ");
        let error  = new Error(message);
        error.status = 422;
        throw error;
    }
    let student = new Student({
        _id:request.body.id,
        Email:request.body.email,
        password:request.body.password
        })
    student.save()
    .then((data)=>{
        token=JWT.sign({_id:data._id,
            email:data.email,
            role:"Student"},
            "MySecretKey", 
            {expiresIn:"1h"});
        response.status(200).json({message:"student created", token})
    })
    .catch(error=>next(error))
}
module.exports.register=(request, response, next)=>{

    let token;
    let result = validationResult(request);
    if(!result.isEmpty())
    {

        let message = result.array().reduce((current, error)=>current+error.msg+", "," ");
        let error  = new Error(message);
        error.status = 422;
        throw error;
    }

    
        let speaker = new Speaker({
            _id:new mongoose.Types.ObjectId,
            name:request.body.name,
            Email:request.body.Email,
            UserName:request.body.userName,
            password:request.body.password,
            Address:{city:request.body.Address.city, street:request.body.Address.street, building: request.body.Address.building}
        });
        speaker.save()
        .then(data=>{
        token = JWT.sign({_id:data._id, email:data.Email, role:"Speaker"}, "MySecretKey", {expiresIn:"1h"});
        response.status(200).json({message:"speaker created", data, token});
    
        })
        .catch(error=>{

            next(error)})

    
}
