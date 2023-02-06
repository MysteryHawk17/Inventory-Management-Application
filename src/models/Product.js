const mongoose=require("mongoose")


const productSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Please enter your name"],
        ref:"User"
    },
    name:{
        type:String,
        required:[true,"Please enter the name of the product"],
        trim:true
    },
    sku:{
        type:String,
        required:[true,"Please add a name"],
        default:"SKU"
    },
    catagory:{
        type:String,
        required:[true,"Please enter a catagory"],
        trim:true
    },
    quantity:{
        type:Number,
        required:[true,"Enter the quantity of the product"],
        default:0
    },
    price:{
        type:Number,
        required:[true,"Enter the price of the product"],

    },
    description:{
        type:String,
        required:[true,"Add a description for the product"],
        trim:true
    },
    image:{
        type:Object,
        default:{}
    }
},{timestamps:true})

const productModel=mongoose.model("Product",productSchema)

module.exports=productModel;