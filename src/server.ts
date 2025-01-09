import app from './app';
import { Config } from './config';
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
    } catch (error) {
        console.log(`MongoDB connection error :: ${error}`);
    }
};

connectDBAndStartServer();
