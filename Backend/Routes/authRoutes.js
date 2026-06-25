import express from 'express';
import {handleLogin,handleRegister } from '../controllers/authControllers.js';
import {validationMiddleware} from '../middleware/validationMiddleware.js';
import { userLoginSchema, userRegistrationSchema } from '../validation/validateData.js';
import { limiter, speedLimiter } from '../middleware/rateLimit.js';
import rateLimit from 'express-rate-limit';
const authRouter=express.Router();

authRouter.post("/register",speedLimiter,limiter,validationMiddleware(userRegistrationSchema),handleRegister); // there is a zod validation middleware for checking the inputs 
authRouter.post("/login",speedLimiter,limiter,validationMiddleware(userLoginSchema),handleLogin);




export default authRouter;