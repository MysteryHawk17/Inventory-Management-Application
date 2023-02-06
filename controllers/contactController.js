const asyncHandler=require("express-async-handler");
const userDB= require("../models/User");
const sendEmail = require("../utils/sendEmail");


const contactUs=asyncHandler(async(req,res)=>{
  
   //set up sending mail options 
   // add reply to to the mail option

   const {subject,message}=req.body;
   const user=await userDB.findById({_id:req.id})
   if(!subject||!message)
   {
    res.status(400)
    throw new Error ("Enter the data properly")

   }
   if(!user)
   {
        res.status(404)
        throw new Error("User not found")
   }

            const send_to=process.env.EMAIL_USER
            const sent_from=process.env.EMAIL_USER
            const reply_to=user.email
            try{
                await sendEmail(subject,message,send_to,sent_from,reply_to) 
                console.log(send_to,sent_from,reply_to)
                res.status(200).json({message:"Successfully sent your message",success:true})
            }catch{
                res.status(500).json({message:"Unable to send your message",success:false})
            }   
    
})

module.exports={contactUs}