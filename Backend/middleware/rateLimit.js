import rateLimit from 'express-rate-limit';
import slowDown from "express-slow-down";
import { success } from 'zod';



export const limiter= rateLimit({
    windowMs:1*60*1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        success:false,
        message:"Too many requests. Please try again in a minute"
    }
});

export const speedLimiter=slowDown({
    windowMs:1*60*1000,
    delayAfter:5,
    delayMs: ()=>2000,
})



