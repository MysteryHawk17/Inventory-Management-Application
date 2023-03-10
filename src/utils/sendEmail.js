const nodemailer=require("nodemailer")
const sendEmail=async(subject,message,send_to,sent_from,reply_to)=>{
const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:587,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    },
    tls:{
        rejectUnauthorized:false
    }

})
    const options={
        from:sent_from,
        to:send_to,
        replyTo:reply_to,
        subject:subject,
        html:message
    }
    //checking if the the mail is sent properly or not
    transporter.sendMail(options,(err,info)=>{
        if(err)
            console.log(err)
        else
            console.log(info)
    })
}


module.exports=sendEmail

