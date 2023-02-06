const express=require("express")
const router=express.Router();
const{ register, login, logout,loggedIn, forgotpassword, resetpassword }=require("../controllers/authController")

router.post("/register",register);
router.post("/login",login)
router.post("/logout",logout)
router.get("/loggedIn",loggedIn)
router.post("/forgotpassword",forgotpassword) 
router.put("/resetpassword/:token",resetpassword)


module.exports=router;
