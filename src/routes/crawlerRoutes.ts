import { NextFunction, Request, Response, Router } from 'express';
import { CrawlerController } from '../controllers/CrawlerController';
import { validateInputDomains } from '../middlewares/validateInput';
import { IRequestWithDomain } from '../types';

const router = Router();

const crawlerController = new CrawlerController();
// seed url(domain) --> HTTP request to url --> HTML parsing
router
    .route('/static')
    .post(
        validateInputDomains,
        async (req: IRequestWithDomain, res: Response, next: NextFunction) => {
            await crawlerController.staticDomainCrawler(req, res, next);
        }
    );

// TODO: dynamic crawling using headless browser or js engine
router.post('/dynamic');

export default router;
