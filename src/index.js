const express=require("express")
const app=express();
const dotenv=require("dotenv").config()
const mongoose=require("mongoose")
const cors=require("cors")
const bodyParser=require("body-parser");
const errorHandler=require("./middlewares/errorMiddleWare")
const cookieParser=require("cookie-parser")
const path=require("path")
//routes import
const authRoute=require("./routes/authRoutes")
const userRoute=require("./routes/userRoutes")
const productRoute=require("./routes/productRoutes")
const contactRoute=require("./routes/contactRoute")
const protect=require("./middlewares/authMiddleware")
const port=5000||process.env.PORT

//middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

//Routes middleware
app.use("/api/auth",authRoute)
app.use("/api/user",protect,userRoute)
app.use("/api/product",protect,productRoute)
app.use("/api/contact",protect,contactRoute)

//routes
app.get("/",(req,res)=>{
    res.send("Inventory Management API Wroking fine!")
})

//Error Middleware
app.use(errorHandler)
//connections 
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then((e)=>{
    console.log("Connected to MONGODB database")
}).catch((e)=>{
    console.log("Error occured in connecting to MONGODB database")
    console.log(e);
})

app.listen(port,()=>{
    console.log(`Server is listening on ${port} `)
}) 