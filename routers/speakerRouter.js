const express = require("express");
const router = express.Router();
const{body, param, query} = require("express-validator");
const  mongoose  = require("mongoose");
const Authmw = require("./../middlewares/AuthMW");

//controller
const controller = require("./../controllers/speakerController");
const { request } = require("express");

router.use(Authmw)

router.route("/Speaker")
.get(controller.viewEvents)

.put(
    [

        body("Email").isEmail().withMessage("Email not in the correct format"),
        body("userName").isAlphanumeric().withMessage("Username should contain string and number"),
        body("password").isAlphanumeric().withMessage("please choose stronger password"),
        body("Address").isObject().withMessage("Address should include City, Street number, building number")
    ]
    ,controller.updateProfile)
.delete(controller.DeclineEvent)


module.exports=router;

