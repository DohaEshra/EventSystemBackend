const JWT = require("jsonwebtoken")

module.exports=(request, response, next)=>{
    let token, decodedtoken;
    try{
        token= request.get("Authorization").split(" ")[1]
        decodedtoken = JWT.verify(token, "MySecretKey")
    }catch(err){

        next(new Error (err))
    }
    request.body.role = decodedtoken.role;
    request.id = decodedtoken._id;
    next();
}