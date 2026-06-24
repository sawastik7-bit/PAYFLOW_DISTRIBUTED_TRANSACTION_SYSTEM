import express from 'express';
import {handleLogin,handleRegister } from '../controllers/authControllers.js';
import { LoginvalidationMiddleware, registerValidationMiddleware } from '../middleware/validationMiddleware.js';
const authRouter=express.Router();

authRouter.post("/register",registerValidationMiddleware,handleRegister);
authRouter.post("/login",LoginvalidationMiddleware,handleLogin);




export default authRouter;