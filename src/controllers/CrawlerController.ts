import { NextFunction, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { IRequestWithDomain } from '../types';

export class CrawlerController {
    async staticDomainCrawler(
        req: IRequestWithDomain,
        res: Response,
        next: NextFunction
    ) {
        const validDomains: string[] = req.validDomains || [];
        const invalidDomains: string[] = req.invalidDomains || [];

        const jobId = uuidv4();

        return res.json({
            jobId,
            crawlingOnDomains: {
                validDomains,
                msg: 'Only these domains might be crawled',
            },
            unableToCrawl: { invalidDomains, msg: 'These are invalid domains' },
        });
    }
}
