import { NextFunction, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { IRequestWithDomain } from '../types';
import createHttpError from 'http-errors';
import { validDomainQueue } from '../config/queue';
import { validDomainQueueName } from '../config';

export class CrawlerController {
    async staticDomainCrawler(
        req: IRequestWithDomain,
        res: Response,
        next: NextFunction
    ) {
        const validDomains: string[] = req.validDomains || [];
        const invalidDomains: string[] = req.invalidDomains || [];

        if (validDomains.length <= 0) {
            const err = createHttpError(
                500,
                'Internal server error | No valid domains list found'
            );
            next(err);
        }

        const validDomainsGroupId = uuidv4();

        for (const domain of validDomains) {
            await validDomainQueue.add('add valid domain to crawl', {
                domain,
                groupId: validDomainsGroupId,
            });
        }

        return res.json({
            jobId: validDomainsGroupId,
            crawlingOnDomains: {
                validDomains,
                msg: 'Only these domains might be crawled',
            },
            unableToCrawl: { invalidDomains, msg: 'These are invalid domains' },
        });
    }
}
