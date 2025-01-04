import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_CONFIG, validDomainQueueName } from './index';

const connection = new Redis({
    ...REDIS_CONFIG,
    maxRetriesPerRequest: null,
});

export const validDomainQueue = new Queue(validDomainQueueName, { connection });

export const validDomainWorker = new Worker(
    validDomainQueueName,
    async (job) => {}, // TODO: Implement worker for crawling and saving product urls in db
    { connection }
);
