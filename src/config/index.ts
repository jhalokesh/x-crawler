import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const {
    PORT,
    NODE_ENV,
    REDIS_HOST,
    REDIS_PORT,
    REQUEST_DOMAIN_COUNT,
    DB_NAME,
    MONGODB_URI,
    GEMINI_AI_API_KEY,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    REDIS_HOST,
    REDIS_PORT,
    REQUEST_DOMAIN_COUNT, // max number of domains allowed as input
    DB_NAME,
    MONGODB_URI,
    GEMINI_AI_API_KEY,
};

/* global redis configurations */
export const REDIS_CONFIG = {
    host: String(REDIS_HOST),
    port: Number(REDIS_PORT),
};

// * Queue names
export const validDomainQueueName = 'valid-domain-queue';
export const dynamicValidDomainQueueName = 'dynamic-valid-domain-queue';

// * Crawler configurations CONSTANTS
export const scrollOptionsInDynamicCrawling = {
    maxScrolls: 5, // max number of scrolls
    scrollDelay: 1000, // delay between scrolls in 'ms'
};

export const maxDepthAllowedForCrawlling = {
    maxDepth: 1,
};

// * LLM | Google AI CONSTANTS/Config
export const googleAIConfigs = {
    model: 'gemini-1.5-pro',
};
