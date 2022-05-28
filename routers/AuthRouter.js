const express = require("express")
const{body, param, query} = require("express-validator");

const router = express.Router();
const controller = require("./../controllers/AuthController")

router.post("/login", controller.login)
.post("/register/student",[

    body("email").isEmail().withMessage("Email not in the correct format"),
    body("password").isAlphanumeric().withMessage("please choose stronger password")], controller.registerStudent)

.post("/register/Speaker", 
    [    body("Email").isEmail().withMessage("Email not in the correct format"),
    body("userName").isAlphanumeric().withMessage("Username should contain string and number"),
    body("password").isAlphanumeric().withMessage("please choose stronger password"),
    body("Address").isObject().withMessage("Address should include City, Street number, building number")]  
,controller.register);

module.exports = router;
