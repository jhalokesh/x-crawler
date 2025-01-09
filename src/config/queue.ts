import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_CONFIG, validDomainQueueName } from './index';
import { domainCrawlJob } from '../workers/domainCrawlWorker';

const connection = new Redis({
    ...REDIS_CONFIG,
    maxRetriesPerRequest: null,
});

export const validDomainQueue = new Queue(validDomainQueueName, { connection });

export const validDomainWorker = new Worker(validDomainQueueName, domainCrawlJob, { connection });
