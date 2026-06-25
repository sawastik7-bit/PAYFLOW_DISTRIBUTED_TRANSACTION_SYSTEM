import { Queue } from "bullmq";

const notificationQueue = new Queue("notificationQueue", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

export default notificationQueue;