import { NextFunction, Response, Router } from 'express';
import { dynamicValidDomainQueue, validDomainQueue } from '../config/queue';
import { CrawlerController } from '../controllers/CrawlerController';
import { validateInputDomains } from '../middlewares/validateInput';
import { QueueService } from '../services/QueueService';
import { IRequestWithDomain } from '../types';

const router = Router();

//for static crawler
const queueService = new QueueService(validDomainQueue);
const crawlerController = new CrawlerController(queueService);

// seed url(domain) --> HTTP request to url --> HTML parsing
router
    .route('/static')
    .post(
        validateInputDomains,
        async (req: IRequestWithDomain, res: Response, next: NextFunction) => {
            await crawlerController.domainCrawl(req, res, next);
        }
    );

// for dynamic crawler
const dynamicQueueService = new QueueService(dynamicValidDomainQueue);
const dynamicCrawlerController = new CrawlerController(dynamicQueueService);

// dynamic crawling using headless browser
router
    .route('/dynamic')
    .post(
        validateInputDomains,
        async (req: IRequestWithDomain, res: Response, next: NextFunction) => {
            await dynamicCrawlerController.domainCrawl(req, res, next);
        }
    );

export default router;
