import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { handleSearchUser } from '../controllers/userControllers.js';


const userRouter=express.Router();

userRouter.get("/users/search",authMiddleware,handleSearchUser);

