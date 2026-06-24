import razorpayInstance from "../Instances/razorpay";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { pool } from "../config/db";
dotenv.config();

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

    let client = await pool.connect();

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
                sender_id,
                receiver_id,
                amount,
                payment_id,
                order_id,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            `,
            [
                NULL,
                userId,
                amount,
                razorpay_payment_id,
                razorpay_order_id,
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

export const sendMoneyToUser=async(req,res)=>{
    const {amount,receiver_id}=req.body;
if (!amount || amount <= 0) {
    return res.status(400).json({
        success: false,
        message: "Invalid amount"
    });
}
    const sender_id=req.user.userId;


 if (sender_id === receiver_id) {
    return res.status(400).json({
        success: false,
        message: "You cannot send money to yourself"
    });
}


let client;
try{

client=await pool.connect();
await client.query("BEGIN");

 const balanceObj=await client.query(`
        SELECT balance FROM wallets
        WHERE user_id=$1
         FOR UPDATE`,[sender_id]);

if(balanceObj.rowCount === 0){
    await client.query("ROLLBACK");

    return res.status(404).json({
        success:false,
        message:"User not found"
    });
}

if(amount>balanceObj.rows[0].balance){await client.query("ROLLBACK");

    return res.status(400).json({
        success:false,
        message:"Insufficient balance"
    });
}

const receiver = await client.query(
`
SELECT id
FROM wallets
WHERE user_id=$1
`,
[receiver_id]
);

if(receiver.rowCount===0){
await client.query("ROLLBACK");
return res.status(404).json("Receiver not found");

}



await client.query(
            `
            UPDATE wallets
            SET balance = balance - $1
            WHERE user_id = $2
            `,
            [amount, sender_id]
        );



await client.query(
            `
            UPDATE wallets
            SET balance = balance + $1
            WHERE user_id = $2
            `,
            [amount, receiver_id]
        );

        await client.query(
            `INSERT INTO  transactions (sender_id,receiver_id,amount,status,type)
            values ($1,$2,$3,$4,$5)
            `,[sender_id,receiver_id,amount,"SUCCESS","P2P TRANSFER"]);


            await client.query("COMMIT");





            return res.status(200).json({
    success:true,
    message:"Money transferred successfully"
});
    }catch(error){

 if(client) await client.query("ROLLBACK");

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }finally{
       if(client) client.release();
    }


}








const generateHmacSignature=(razorpay_payment_id,razorpay_order_id)=>{
const hmac=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET);

        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
       const digestResult= hmac.digest('hex');
 return digestResult;
}










