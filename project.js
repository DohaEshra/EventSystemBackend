const express = require("express");
const server = express();
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")

//exports
const speakerRouter = require("./routers/speakerRouter");
const studentRouter = require("./routers/studentRouter");
const adminRouter = require("./routers/AdminRouter")
const AuthRouter = require("./routers/AuthRouter")


//mongoose.st
let connection = mongoose.connect("mongodb://0.0.0.0:27017/EventSystemDB")
.then(()=>console.log("DB connected"))
.catch(error=>console.log(error))
server.listen(process.env.PORT||8080,()=>{
    console.log("I'm listening...")
})

server.use(cors())
//logger mw
server.use((request, response, next)=>{
    console.log(request.url, request.method);
    next();
})

//body parsing mw
server.use(body_parser.json());
server.use(body_parser.urlencoded({extended:false}));

//routers
server.use(AuthRouter);
server.use(speakerRouter);
server.use(studentRouter);
server.use(adminRouter);


//not found mw

server.use((request, response)=>{
    response.status(404).json({message:"page not found"})
})

//error mw
server.use((error, request, response, next)=>{
    response.status(500).json({message:error+" "})
})