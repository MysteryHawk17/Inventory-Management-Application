const productDB=require("../models/Product")
const asyncHandler=require("express-async-handler");
const { formatFileSize } = require("../utils/fileUpload");
const cloudinary=require("cloudinary").v2



const createProduct=asyncHandler(async(req,res)=>{
  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUDNAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_APISECRET
  })
  const{name,sku,catagory,quantity,price,description}=req.body;
  // console.log(req.body)
  if(!name||!catagory||!price||!quantity||!description)
  {
    res.status(400)
    throw new Error("Please fill in the field properly")
  }
let uploadedFile

let fileData={}
console.log(req.file)

if(req.file){ 
  try{

    uploadedFile=await cloudinary.uploader.upload(req.file.path,{
      folder:"Inventory Management Application",resource_type:"image"
    })

  }catch{
    res.status(500)
    console.log(uploadedFile)
    throw new Error("Error in uploading file to  cloudinary")
  }
  fileData={
    fileName:req.file.originalname,
    filePath:uploadedFile.secure_url,
    fileType:req.file.mimetype,
    fileSize:formatFileSize(req.file.size,2)
  }
}

  const newProduct=new productDB({
    user:req.id,
    name,
    catagory,
    sku,
    price,
    quantity,
    description,
    image:fileData
  })
  const savedProduct=await newProduct.save();
  if(savedProduct)
  {res.status(200).json({message:"Saved the product successfully",savedProduct})}
  else
  {
    res.status(500)
    throw new Error("Error in saving the product")
  }

 

})
const getallproduct=asyncHandler(async(req,res)=>{

  //getting product by the particular user 
  const products=await productDB.find({user:req.id}).sort("-createdAt");
  if(products)
  {
    res.status(200).json({message:"Successfully fetched the products",products})

  }
  else
  {
    res.status(400)
    throw new Error("Error in fetching the product for the user")
  }
})

const getproduct=asyncHandler(async(req,res)=>{
  const product=await productDB.findById(req.params.id)
  if(!product)
  {
    res.status(404)
    throw new Error("Product not found!!")
  }
  if(!(product.user==req.id))
  {
    res.status(400)
    throw new Error("Not authorized!!")
  }
  res.status(200).json({message:"Product found",product})
})
const deleteproduct=asyncHandler(async(req,res)=>{
  const id=req.params.id;
  const product=await productDB.findById({_id:id})
  if(!product)
  {
    res.status(404)
    throw new Error("Product does not exists")
  }
 
  if(!(product.user==req.id))
  {
    res.status(400)
    throw new Error("Unauthorized product delete")
  }
  const deleted =await productDB.findByIdAndDelete({_id:id});
  if(deleted)
  {
    res.status(200).json({message:"The following product has been successfully deleted",deleted})
  }
  else
  {
    res.status(400)
    throw new Error("Unable to delete the product")

  }

  

})
const updateproduct=asyncHandler(async(req,res)=>{
  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUDNAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_APISECRET
  })
  const{name,sku,catagory,quantity,price,description}=req.body;
  const product=await productDB.findById(req.params.id)
  if(!product)
  {
    res.status(404)
    throw new Error("Product does not exists")
  }
  if(!(product.user==req.id))
  {
    res.status(400)
    throw new Error("Unauthorized product edit")
  }
let uploadedFile

let fileData={}
// console.log(req.file)

if(req.file){ 
  try{
    uploadedFile=await cloudinary.uploader.upload(req.file.path,{
      folder:"Inventory Management Application",resource_type:"image"
    })

  }catch{
    res.status(500)
    console.log(uploadedFile)
    throw new Error("Error in uploading file to  cloudinary")
  }
  fileData={
    fileName:req.file.originalname,
    filePath:uploadedFile.secure_url,
    fileType:req.file.mimetype,
    fileSize:formatFileSize(req.file.size,2)
  }
}
const updatedProduct=await productDB.findByIdAndUpdate({_id:req.params.id},{name,
  sku,
  catagory,
  quantity,
  price,
  description,
  image:Object.keys(fileData).length===0?product.image:fileData
},{new:true})

  if(updatedProduct)
  {res.status(200).json({message:"Saved the product successfully",updatedProduct})}
  else
  {
    res.status(500)
    throw new Error("Error in saving the product")
  }

 

})
module.exports={createProduct,getallproduct,getproduct,deleteproduct,updateproduct}