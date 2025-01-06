import { Job } from 'bullmq';
import app from './app';
import { Config } from './config';
import { validDomainWorker } from './config/queue';
import connectDB from './db';

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => console.log('Server running', { port: PORT }));
    } catch (err) {
        if (err instanceof Error) {
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
        process.exit(1);
    }
};

const connectDBAndStartServer = async () => {
    try {
        await connectDB();
        startServer();
        // TOOD: implement logger
        console.log('Starting worker...');
        validDomainWorker.on('completed', (job: Job) => {
            console.log(`Job completed: ${job.id}`);
        });

        validDomainWorker.on('failed', (job: Job | undefined, err) => {
            console.log(`Job failed: ${err}`);
        });
    } catch (error) {
        console.log(`MongoDB connection error :: ${error}`);
    }
};

connectDBAndStartServer();
