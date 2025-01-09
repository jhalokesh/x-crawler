import { BulkJobOptions, Queue } from 'bullmq';

export class QueueService {
    private queue: Queue;

    constructor(queue: Queue) {
        this.queue = queue;
    }

    async addBulk(jobs: { name: string; data: any; opts?: BulkJobOptions }[]): Promise<void> {
        await this.queue.addBulk(jobs);
    }
}
