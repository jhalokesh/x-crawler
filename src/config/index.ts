import path from 'path';
import { config } from 'dotenv';

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { PORT, NODE_ENV, REDIS_HOST, REDIS_PORT } = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    REDIS_HOST,
    REDIS_PORT,
};

export const REDIS_CONFIG = {
    host: String(REDIS_HOST),
    port: Number(REDIS_PORT),
};
