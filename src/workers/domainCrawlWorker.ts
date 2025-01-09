import { Job } from 'bullmq';
import { domainService } from '../services/DomainService';
import { crawlerService } from '../services/CrawlerService';
import { CrawlDomainStatus } from '../types';

export const domainCrawlJob = async (job: Job) => {
    const { domain, groupId } = job.data;
    try {
        // upsert domain with groupId in DB
        const crawlDomainDoc = await domainService.upsertDomain(domain, groupId);
        const domainId = crawlDomainDoc.id;

        // check if domain is crawling by other process or has been already crawled
        if (crawlDomainDoc.status === 'in-progress' || crawlDomainDoc.status === 'completed') {
            console.log(`Domain ${domain} already processed. Skipping crawl.`);
            return; // no need to crawl
        }

        /**
         * proceed crawling
         * update domain-status to in-progress
         */
        await domainService.crawlDomainStatus(domainId, CrawlDomainStatus.IN_PROGRESS);
        const productUrls: string[] = await crawlerService.startCrawl(domain, 0);
        if (productUrls.length <= 0) {
            console.log(`Something went wrong while crawling ${domain} or no product urls found!`);
            return;
        }

        // save productUrls with domainId and update domain-status to completed
        await domainService.saveProductUrls(productUrls, domainId);
        await domainService.crawlDomainStatus(domainId, CrawlDomainStatus.COMPLETED);

        console.log(`crawling success for ${domain}`);
    } catch (error) {
        // TODO: implement logger
        // TODO: improve logic error handling
        console.error(`Error processing domain ${domain}`, error);
    }
};
