import razorpayInstance from "../Instances/razorpay";


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