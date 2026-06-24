import express from 'express';
import razorpayInstance from '../Instances/razorpay.js';
import { authMiddleware } from '../middleware/authMiddleware';
import { handleOrderCreate,handleVerificationOfPayment,sendMoneyToUser,handleFetchBalance } from '../controllers/paymentController.js';
const paymentRouter=express.Router();


paymentRouter.post("/create-order",authMiddleware,handleOrderCreate);
paymentRouter.post("/verify-payment",authMiddleware,handleVerificationOfPayment);
paymentRouter.post("/send-money",authMiddleware,sendMoneyToUser);
paymentRouter.get("/wallet",authMiddleware,handleFetchBalance);

export default paymentRouter;