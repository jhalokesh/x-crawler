import { NextFunction, Request, Response, Router } from 'express';
import { CrawlerController } from '../controllers/CrawlerController';
import { validateInputDomains } from '../middlewares/validateInput';
import { IRequestWithDomain } from '../types';
import { QueueService } from '../services/QueueService';
import { validDomainQueue } from '../config/queue';

const router = Router();

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

// TODO: dynamic crawling using headless browser or js engine
router.post('/dynamic');

export default router;
