const express=require("express")
const router=express.Router();
const{getUser, updateUser, passwordChange}=require("../controllers/userControllers")


router.get("/",getUser) 
router.patch("/updateuser",updateUser)
router.patch("/updatepassword",passwordChange)

module.exports=router