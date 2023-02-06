const userDB=require("../models/User")
const asyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")

const protect=asyncHandler(async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token)
        {
            res.status(401)
            throw new Error("Not Authorized! Please login!")
        }
        const verifiedToken=jwt.verify(token,process.env.JWT_SECRET)
        if(verifiedToken)
        {
            const id=verifiedToken.id;
            const username=verifiedToken.username
            const email=verifiedToken.email
            req.id=id
            req.username=username
            req.email=email
            
        }
        else
        {
            res.status(401)
            throw new Error("Not verified token!!")
        }
        next();
    }catch{
        res.status(401)
        throw new Error("Not Authorized! Please login!")
    }
})
module.exports=protect