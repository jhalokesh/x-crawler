import mongoose, { Mongoose } from 'mongoose';
import { Config } from '../config/index';

export let dbInstance: Mongoose | undefined = undefined;
const MONGODB_URI = Config.MONGODB_URI;
const DB_NAME = Config.DB_NAME;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${MONGODB_URI}/${DB_NAME}`
        );
        dbInstance = connectionInstance;
        // TODO: Implement logger
        console.log(
            `\nMongoDB connected! \nDB Host :: ${connectionInstance.connection.host} \nDB port :: ${connectionInstance.connection.port}`
        );
    } catch (error) {
        console.log(`MongoDB connection error :: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
