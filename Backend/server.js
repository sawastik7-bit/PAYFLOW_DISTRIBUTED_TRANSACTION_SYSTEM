import express from 'express';
import authRouter from './Routes/authRoutes.js';
import dotenv from 'dotenv';
import { connectDB } from './connection/connectDB.js';
dotenv.config();
connectDB();
const app=express();
app.use(express.json());


app.use("/payflow",authRouter);


app.listen(process.env.PORT || 5000,()=>{
    console.log("server is running ");
});



