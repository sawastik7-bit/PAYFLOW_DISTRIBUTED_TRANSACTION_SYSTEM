import express from 'express';
import razorpayInstance from '../Instances/razorpay.js';
import { authMiddleware } from '../middleware/authMiddleware';
import { handleOrderCreate } from '../controllers/paymentController.js';
const paymentRouter=express.Router();


paymentRouter.post("/create-order",authMiddleware,handleOrderCreate);

export default paymentRouter;