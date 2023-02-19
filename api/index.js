import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersRoute from "./routes/user.js";
import checkRoute from "./routes/check.js";
import cookieParser from "cookie-parser"
const app = express();
dotenv.config();

mongoose.set("strictQuery", false);
async function main() {
  try {
    await mongoose.connect(process.env.MONGO);
  } catch (err) {
    throw err;
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from mongoDB!");
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB!");
});

//middlewares
app.use(cookieParser())
app.use(express.json()); //Allows express server to use json objects

app.use("/user", usersRoute);
app.use("/check", checkRoute);


//error handling middleware
app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success:false,
        status: errorStatus,
        message: errorMessage,
        stack:err.stack
    }
    )
})



app.listen(8800, () => {
  main();
  console.log("Connected to server!");
});
