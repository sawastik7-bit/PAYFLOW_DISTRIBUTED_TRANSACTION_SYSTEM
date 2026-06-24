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


export const handleVerificationOfPayment = async (req, res) => {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        amount
    } = req.body;

    const userId = req.user.userId;

    if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature ||
        !amount
    ) {
        return res.status(400).json({
            success: false,
            message: "Missing payment details"
        });
    }

    const client = await pool.connect();

    try {

       
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }


        await client.query("BEGIN");

        
        await client.query(
            `
            UPDATE wallets
            SET balance = balance + $1
            WHERE user_id = $2
            `,
            [amount, userId]
        );

        
        await client.query(
            `
            INSERT INTO transactions
            (
                user_id,
                payment_id,
                order_id,
                amount,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5)
            `,
            [
                userId,
                razorpay_payment_id,
                razorpay_order_id,
                amount,
                "SUCCESS"
            ]
        );

       
        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Payment verified and wallet updated successfully."
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    } finally {

        client.release();

    }
};









const generateHmacSignature=(razorpay_payment_id,razorpay_order_id)=>{
const hmac=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET);

        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
       const digestResult= hmac.digest('hex');
 return digestResult;
}