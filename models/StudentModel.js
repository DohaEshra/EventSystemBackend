const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);




//Encryption
const bcrypt = require("bcrypt");


//ReGex
let validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

//schema
let studentSchema = new mongoose.Schema({
    _id:{type:Number},
    Email:{type:String, required:true, unique:true, validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    password:{type:String, required:true},
});



studentSchema.plugin(AutoIncrement, { inc_field: "_id" });



//hashing password
studentSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }
    catch(error){
        next(error)
    }
})
studentSchema.pre('findOneAndUpdate', async function(next){
    try{
    const update = this.getUpdate()
  if (update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    this.setUpdate({ $set: { 
       password: passwordHash, 
       confirmpw: undefined 
      } 
    });
  }
  next()
    }
    catch(error){
        next(error)
    }
})


module.exports=mongoose.model("Students", studentSchema)