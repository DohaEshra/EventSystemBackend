const express = require("express");
const router = express.Router();
const controller = require("./../controllers/StudentController");
const{body, param, query} = require("express-validator");
const Student = require("./../models/StudentModel")
const authMW = require("./../middlewares/AuthMW")


router.use(authMW)

router.route("/Students")
.get(controller.ViewEvents)
.post([

    body("email").isEmail().withMessage("email not in the correct format"),
    body("password").isAlphanumeric().withMessage("please choose stronger password"),
], controller.CreateStudent)
.put([

    body("email").isEmail().withMessage("Email not in the correct format"),
    body("password").isAlphanumeric().withMessage("please choose stronger password"),
],controller.Editprofile)


module.exports=router;

