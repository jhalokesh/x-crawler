import { Job } from 'bullmq';

import { dynamicDomainService, staticDomainService } from '../db/modelInstance';
import { crawlerService } from '../services/CrawlerService';
import { DomainService } from '../services/DomainService';
import { CrawlDomainStatus, IDomainDocument, IProductUrlsDocument } from '../types';

// helper function to process worker
const processDomainWorker = async (
    job: Job,
    crawlMethod: (domain: string, maxDepth: number) => Promise<string[]>,
    domainServiceInstance: DomainService<IDomainDocument, IProductUrlsDocument>
) => {
    const { domain, groupId } = job.data;
    try {
        // upsert domain with groupId in DB
        const crawlDomainDoc = await domainServiceInstance.upsertDomain(domain, groupId);
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
        await domainServiceInstance.crawlDomainStatus(domainId, CrawlDomainStatus.IN_PROGRESS);
        const productUrls: string[] = await crawlMethod(domain, 0);
        if (productUrls.length <= 0) {
            console.log(`Something went wrong while crawling ${domain} or no product urls found!`);
            return;
        }

        // save productUrls with domainId and update domain-status to completed
        await domainServiceInstance.saveProductUrls(productUrls, domainId);
        await domainServiceInstance.crawlDomainStatus(domainId, CrawlDomainStatus.COMPLETED);

        console.log(`crawling success for ${domain}`);
    } catch (error) {
        // TODO: implement logger
        // TODO: improve logic error handling
        console.error(`Error processing domain ${domain}`, error);
    }
};

// for static crawler
export const domainCrawlJob = async (job: Job) => {
    await processDomainWorker(job, crawlerService.startCrawl, staticDomainService);
};

// for dynamic crawler
export const dynamicDomainCrawlJob = async (job: Job) => {
    await processDomainWorker(job, crawlerService.startCrawlDynamic, dynamicDomainService);
};
