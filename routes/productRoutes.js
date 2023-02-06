const express=require("express")
const {createProduct,getallproduct, getproduct, deleteproduct, updateproduct}=require("../controllers/productController")
const { upload } = require("../utils/fileUpload")
const router=express.Router() 




router.post("/create",upload.single("image"),createProduct)
router.get("/getallproduct",getallproduct);
router.get("/getproduct/:id",getproduct);
router.delete("/deleteproduct/:id",deleteproduct)
router.patch("/updateproduct/:id",upload.single("image"),updateproduct)

module.exports=router;