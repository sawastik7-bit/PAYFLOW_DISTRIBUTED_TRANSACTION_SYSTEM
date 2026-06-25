import express from 'express';
import authRouter from './Routes/authRoutes.js';
import dotenv from 'dotenv';
import { connectDB } from './connection/connectDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import paymentRouter from './Routes/paymentRoutes.js';
import {limiter,speedLimiter} from './middleware/rateLimit.js';

dotenv.config();
connectDB();
const app=express();

app.use(cors({
    origin:"*"
}));
app.use(cookieParser());
app.use(express.json());


app.use("/payflow",authRouter); // this is the authentication routes
app.use("/payflow/api/payment",paymentRouter); // this is the payment route


app.listen(process.env.PORT || 5000,()=>{
    console.log("server is running ");
});



