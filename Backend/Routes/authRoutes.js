import express from 'express';
import {handleLogin,handleRegister } from '../controllers/authControllers.js';
import {validationMiddleware} from '../middleware/validationMiddleware.js';
import { userLoginSchema, userRegistrationSchema } from '../validation/validateData.js';
const authRouter=express.Router();

authRouter.post("/register",validationMiddleware(userRegistrationSchema),handleRegister); // there is a zod validation middleware for checking the inputs 
authRouter.post("/login",validationMiddleware(userLoginSchema),handleLogin);




export default authRouter;