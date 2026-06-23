import express from 'express';
import razorpayInstance from '../Instances/razorpay.js';
import { authMiddleware } from '../middleware/authMiddleware';
import { handleOrderCreate,handleVerificationOfPayment } from '../controllers/paymentController.js';
const paymentRouter=express.Router();


paymentRouter.post("/create-order",authMiddleware,handleOrderCreate);
paymentRouter.post("/verify-payment",authMiddleware,handleVerificationOfPayment);

export default paymentRouter;