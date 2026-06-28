import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { handleOrderCreate,handleVerificationOfPayment,sendMoneyToUser,handleFetchBalance,handleFetchTransactions } from '../controllers/paymentController.js';
import { limiter, speedLimiter } from '../middleware/rateLimit.js';
const paymentRouter=express.Router();


paymentRouter.post("/create-order",authMiddleware,handleOrderCreate);
paymentRouter.post("/verify-payment",authMiddleware,handleVerificationOfPayment);
paymentRouter.post("/send-money",speedLimiter,limiter,authMiddleware,sendMoneyToUser);
paymentRouter.get("/wallet",authMiddleware,handleFetchBalance);
paymentRouter.get("/transactions",authMiddleware,handleFetchTransactions);

export default paymentRouter;