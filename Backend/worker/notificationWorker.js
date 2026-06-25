import { Worker } from "bullmq";

const notificationWorker = new Worker(
    "notificationQueue",
    async (job) => {
        console.log(job.data);
    },
    {
        connection: {
            host: "localhost",
            port: 6379,
        },
    }
);
