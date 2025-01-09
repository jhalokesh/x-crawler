import { Job, Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_CONFIG, validDomainQueueName } from './index';
import { domainCrawlJob } from '../workers/domainCrawlWorker';

const connection = new Redis({
    ...REDIS_CONFIG,
    maxRetriesPerRequest: null,
});

export const validDomainQueue = new Queue(validDomainQueueName, { connection });

export const validDomainWorker = new Worker(validDomainQueueName, domainCrawlJob, { connection });

// TOOD: implement logger
validDomainWorker.on('completed', (job: Job) => {
    console.log(`Job completed: ${job.id}`);
});

validDomainWorker.on('failed', (job: Job | undefined, err) => {
    console.log(`Job failed: ${err}`);
});
