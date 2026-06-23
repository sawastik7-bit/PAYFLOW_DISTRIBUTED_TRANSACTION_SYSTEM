import razorpayInstance from "../Instances/razorpay";
import crypto from 'crypto';

export const handleOrderCreate=async(req,res)=>{

    const {amount}=req.body;

    try{
        const options={
            amount:amount*100,
            currency:'INR',
        };

        const order=await razorpayInstance.orders.create(options);

        res.status(200).json(order);
    }catch(error){
        console.error(error);
        res.status(500).send('Error creating razorpay order');
    }

}


export const handleVerificationOfPayment=async(req,res)=>{

    const {razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature}=req.body;

        const generatedSignature=createdSignature(razorpay_payment_id,razorpay_order_id);

        
        try{

if(generatedSignature!==razorpay_signature){
    return res.status(400).json({
        message:"Unauthorized transaction",
        success:false
    });


}


        }catch(error){
            return res.status(500).send("Internal server Error");
        }


}
















const createdSignature=(razorpay_payment_id,razorpay_order_id)=>{
const hmac=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET);

        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
       const digestResult= hmac.digest('hex');
 return digestResult;
}