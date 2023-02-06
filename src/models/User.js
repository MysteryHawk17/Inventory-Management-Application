const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:[true,"Email already exists"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"Please add a password"],
    },
    photo:{
        type:String,
        required:[true,"Please add a photo"],
        default:"https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone:{
        type:String,
        default:"+91"
    },
    bio:{
        type:String,
        maxLength:[250,"Bio must be of 250 words or less"],
        default:""
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
   
    if(this.isModified("password"))
    {
        const salt=await bcrypt.genSalt(10)
        this.password=await bcrypt.hash(this.password,10)
    }
    next();
})

const userModel=mongoose.model("User",userSchema);
module.exports=userModel