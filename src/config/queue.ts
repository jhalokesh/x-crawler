import { Job, Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { dynamicValidDomainQueueName, REDIS_CONFIG, validDomainQueueName } from './index';
import { domainCrawlJob, dynamicDomainCrawlJob } from '../workers/domainCrawlWorker';

const connection = new Redis({
    ...REDIS_CONFIG,
    maxRetriesPerRequest: null,
});

// for static cralwer
export const validDomainQueue = new Queue(validDomainQueueName, { connection });

export const validDomainWorker = new Worker(validDomainQueueName, domainCrawlJob, { connection });

// TOOD: implement logger
validDomainWorker.on('completed', (job: Job) => {
    console.log(`Job completed: ${job.id}`);
});

validDomainWorker.on('failed', (job: Job | undefined, err) => {
    console.log(`Job failed: ${err}`);
});

// for dynamic crawler
export const dynamicValidDomainQueue = new Queue(dynamicValidDomainQueueName, { connection });

export const dynamicValidDomainWorker = new Worker(
    dynamicValidDomainQueueName,
    dynamicDomainCrawlJob,
    {
        connection,
    }
);

// TOOD: implement logger
dynamicValidDomainWorker.on('completed', (job: Job) => {
    console.log(`Job completed: ${job.id}`);
});

dynamicValidDomainWorker.on('failed', (job: Job | undefined, err) => {
    console.log(`Job failed: ${err}`);
});
