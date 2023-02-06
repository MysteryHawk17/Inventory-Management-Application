const bcrypt=require("bcryptjs")
const userDB=require("../models/User")
const asyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const crypto=require("crypto")
const tokenDB=require("../models/TokenModel")
const sendEmail = require("../utils/sendEmail")

const generateToken=(id,username,email)=>{
    const token= jwt.sign({id,username,email},process.env.JWT_SECRET)
    return token;
}
const register=asyncHandler (async(req,res)=>{
    const {name,email,password,photo,phone,bio}=req.body
    if(!email||!name||!password)
    {
        res.status(400)
        throw new Error("Fill in all the required fields")
    }
    const findUser=await userDB.findOne({email:email})
    if(findUser)
    {
        res.status(400)
        throw new Error("User already exists. Please login!")
    }
    else
    {
    
        const newUser=new userDB({
            username:name,
            email:email,
            password:password,
            photo:photo,
            phone:phone,
            bio:bio
        })
        const savedUser=await newUser.save();
        const token=generateToken(savedUser._id,savedUser.username,savedUser.email);
        //saving it in form of a cookiee
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now()+1000*86400),
            sameSite:"none",
            secure:true            
        })
        if(savedUser)
        {
        const{_id,password, createdAt,updatedAt,...userData}=savedUser._doc;
        
        res.status(201).json({message:"User Created",userData})
        console.log(token)
        console.log(userData)
        }
        else
        {
            res.status(400)
            throw new Error("Error in creating new user")
        }
    
}
}

)
const login=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password)
    {
        res.status(400)
        throw new Error ("Please enter your email and password properly")
    }
    else
    {
        const foundUser=await userDB.findOne({email:email})
        if(foundUser)
        {
            const verifyPassword=await bcrypt.compare(password,foundUser.password);
            if(verifyPassword)
            {
                const token=generateToken(foundUser._id,foundUser.username,foundUser.email)
                res.cookie("token",token,{
                    path:'/',
                    httpOnly:true,
                    expires:new Date(Date.now()+1000*86400),
                    sameSite:"none",
                    secure:true   
                })
                const{_id,password,createdAt,updatedAt,...userData}=foundUser._doc
                res.status(200).json({message:"Valid user Login successful",userData})
            }
            else
            {
                res.status(400)
                throw new Error("Not a valid password. Reenter");
            }
        }
        else
        {
            res.status(400)
            throw new Error("User does not exist. Please sign In")
        }
    }
})
const logout=asyncHandler(async(req,res)=>{
    res.cookie("token","token",{
        path:'/',
        httpOnly:true,
        expires:new Date(0),
        sameSite:"none",
        secure:true  
    })
    res.status(200).json({message:"Successfully Logged Out"})
})
const loggedIn=asyncHandler(async(req,res)=>{
    const token=req.cookies.token
    if(!token)
    {
       return res.json(false)
    }
    const verified=jwt.verify(token,process.env.JWT_SECRET)
    if(verified)
    {
        return(res.json(true))
    }
    return(res.json(false))

    
})
const forgotpassword=asyncHandler(async(req,res)=>{
        const {email}=req.body;
        if(!email)
        {
            res.status(400)
            throw new Error("Please enter the email to resent password")
        }
        const user=await userDB.findOne({email:email})
        if(!user)
        {
            res.status(404)
            throw new Error("User not found")
        }
        else
        {
            const tokenExists=await tokenDB.findOne({userId:user._id})
            if(tokenExists)
            {
                await tokenDB.deleteOne({userId:user._id});
            }
            const resetToken=crypto.randomBytes(32).toString("hex")+user._id
            const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex")
            console.log(resetToken)
            // console.log(hashedToken)
            const savedToken= await new tokenDB({
                userId:user._id,
                token:hashedToken,
                createdAt:Date.now(),
                expiresAt:Date.now()+30*(60*1000)

            }).save();
            console.log(savedToken) 
            const resetUrl=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
            console.log(resetUrl);
            const message=
            `<h2>Hello ${user.username}</h2>
            <p>Please click on the below link to reset the password</p>
            <p>The reset link is valid for 30 minutes</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>Regards</p>`;
            const subject="PASSWORD RESET"
            const send_to=user.email
            const sent_from=process.env.EMAIL_USER

            try{
                await sendEmail(subject,message,send_to,sent_from)
                res.status(200).json({message:"Successfully sent the reset email",success:true})
            }catch{
                res.status(500).json({message:"Unable to send the reset email",success:false})
            }   

        }
    
})

const resetpassword=asyncHandler(async(req,res)=>{
    const{token}=req.params
    const{password}=req.body
    const hashedToken=crypto.createHash("sha256").update(token).digest("hex")
    const verifyToken=await tokenDB.findOne({token:hashedToken,expiresAt:{$gt:Date.now()}})
    if(!verifyToken)
    {
        res.status(400)
        throw new Error("Invalid or Expired Token")
    }
    const user=await userDB.findOne({_id:verifyToken.userId})
    if(!user)
    {
        res.status(404)
        throw new Error("User does not exists")
    }
    else
    {
        user.password=password
        await user.save();
        res.status(200).json({message:"Updated password successfully!"})
    }
    
})
module.exports={register,login,logout,loggedIn,forgotpassword,resetpassword}