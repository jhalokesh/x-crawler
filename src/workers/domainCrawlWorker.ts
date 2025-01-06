import { Job } from 'bullmq';
import { domainService } from '../services/DomainService';

export const domainCrawlJob = async (job: Job) => {
    const { domain, groupId } = job.data;
    try {
        // upsert domain with groupId in DB
        const domainDoc = await domainService.upsertDomain(domain, groupId);

        // Check if crawling is needed
        if (domainDoc.jobId.length !== 1) {
            /*
             * If jobId[] length is not equal to or greater than 1,
             * it means some other process is already crawling or has crawled this domain,
             * so no need to crawl again,
             * TTL is already added on Document to prevent long persisted domain crawled data
             */
            // TODO: implement logger - if required
            console.log(`Domain ${domain} already processed. Skipping crawl.`);
            return;
        }
        // Proceed crawling
        // const productUrls: string[] = await crawlService.crawl(domain);
        const productUrls = [
            'amazon.com',
            'flipkart.in',
            'shop.myntra.com',
            'store.ebay.co.uk',
        ]; // this will come from crawler service

        // save productUrls with domainId in DB
        const domainId = domainDoc.id;
        await domainService.saveProductUrls(productUrls, domainId);

        console.log(`crawling success for ${domain}`);
    } catch (error) {
        // TODO: implement logger
        // TODO: improve logic error handling
        console.error(`Error process domain ${domain}`, error);
    }
};
