const bcrypt=require("bcryptjs")
const userDB=require("../models/User")
const asyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")
const errorHandler = require("../middlewares/errorMiddleWare")


const getUser=asyncHandler(async(req,res)=>{
    const id=req.id
    const foundUser=await userDB.findById({_id:id})
    if(foundUser)
    {
    const{password,createdAt,updatedAt,...userData}=foundUser._doc
    res.status(200).json({message:"User Found",userData})
    }
    else
    {
        res.status(400)
        throw new Error("User not found!")
    }
})
const updateUser=asyncHandler(async(req,res)=>{
    const id=req.id;
    const foundUser=await userDB.findById({_id:id})
    if(foundUser)
    {
        const{username,photo,phone,bio}=req.body
        foundUser.username=username||foundUser.username
        foundUser.email=foundUser.email
        foundUser.phone=phone||foundUser.phone
        foundUser.photo=photo||foundUser.photo
        foundUser.bio=bio||foundUser.bio
        const updatedUser=await foundUser.save();
        const{createdAt,updatedAt,password,...userData}=updatedUser._doc
        res.status(200).json({message:"Updated User Successfully",userData})
        
    }
    else
    {
        res.status(400)
        throw new Error("User not found")
    }

})
const passwordChange=asyncHandler(async(req,res)=>{
   
   
    //check if old password matches the db password
    //if all this iis correct user and verified password exists then save the password in the db send response

    const user=await userDB.findById(req.id);
    if(!user)
    {
        res.status(400)
        throw new Error("User not found! Please login")
    }
    const {oldpassword,password}=req.body;
    if(!password||!oldpassword)
    {
        res.status(400)
        throw new Error("Enter the old password and new password properly")
    }
    const validPassword=await bcrypt.compare(oldpassword,user.password);
    if(!validPassword)
    {
        res.status(401)
        throw new Error("Old password entered is wrong. Reenter the password")

    }
    if(user&&password)
    {
        user.password=password;
        await user.save();
        res.status(200).json({message:"Password updated successfully"})
    }
})
module.exports={getUser,updateUser,passwordChange}