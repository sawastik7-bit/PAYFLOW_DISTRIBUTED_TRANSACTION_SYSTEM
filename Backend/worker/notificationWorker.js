import { Worker } from "bullmq";
import transporter from "../services/emailService.js";

const notificationWorker = new Worker(
    "notificationQueue",
    async (job) => {

        const { receiverEmail, senderName, amount } = job.data;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: receiverEmail,
            subject: "Payment Received",
            text: `You have received ₹${amount} from ${senderName}.`
        });

        console.log("Email sent successfully!");
    },
    {
        connection: {
            host: "localhost",
            port: 6379,
        },
    }
);
