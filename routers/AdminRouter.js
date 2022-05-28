const express = require("express");
const router = express.Router();
const{body, param, query, validationResult} = require("express-validator");
const mongoose = require("mongoose")
const Authmw = require("./../middlewares/AuthMW");

//controller
const controller = require("./../controllers/AdminController")

router.use(Authmw)

router.route("/Admin")
.post([
    body("id").isNumeric().withMessage("Event id should be number"),
    body("title").isString().withMessage("Title should be string"),
    body("Date").isString().withMessage("Event date should be string"),
    body("MainSpeaker").custom(value=>{
        if(mongoose.isValidObjectId(value))
        {return true}
    }).withMessage("Main speaker id should be object ID"),
    body("OtherSpeakers").isArray().withMessage("should be an array").custom(value=>{
        return value.every((element)=>{
            if(mongoose.isValidObjectId(element))
        {return true}
        })
        
    }).withMessage("other speaker id should be object ID"),
    body("students").isArray().isNumeric().withMessage("student id should ne a number")
], controller.AddEvent)//add event
.put([
    body("id").isNumeric().withMessage("Event id should be number"),
    body("title").isString().withMessage("Title should be string"),
    body("Date").isDate().withMessage("Event date should be date"),
    body("MainSpeaker").custom(value=>{
        if(mongoose.isValidObjectId(value))
        {return true}
    }).withMessage("Main speaker id should be object ID"),
    body("OtherSpeakers").isArray().withMessage("should be an array").custom(value=>{
        return value.every((element)=>{
            if(mongoose.isValidObjectId(element))
        {return true}
        })
        
    }).withMessage("other speaker id should be object ID"),
    body("students").isArray().isNumeric().withMessage("student id should ne a number")
], controller.EditEvent)//edit event
.delete(controller.DeleteEvent)//delete evet
router.put("/Admin/editpeople",[
    body("Email").isEmail().withMessage("Email not in the correct format"),
    body("NewEmail").isEmail().withMessage("email not in the correct format"),
    body("Address").isObject().withMessage("Address should include City, Street number, building number"), 
    body("userName").isAlphanumeric().withMessage("Username should contain string and number")
    
] ,controller.EditPeople)//edit people
router.delete("/Admin/deletepeople",[
    query("Email").isEmail().withMessage("Email not in the correct format"),
], controller.DeletePeople)//delete student
router.put("/Admin/addpeople",controller.AddSpeakersORStudents)//update events speakers and students
router.get("/Admin/ViewSpeakers", controller.ViewSpeakers);
router.get("/Admin/ViewStudents", controller.ViewStudents);

module.exports = router;