import { StaticCrawlDomain } from '../models/StaticCrawlDomain';
import { StaticCrawlProductUrl } from '../models/StaticCrawlProductUrl';

export class DomainService {
    async upsertDomain(domain: string, groupId: string) {
        return await StaticCrawlDomain.findOneAndUpdate(
            { domain },
            { $addToSet: { jobId: groupId } },
            { new: true, upsert: true }
        );
    }

    async crawlDomainStatus(domainId: string, status: string) {
        await StaticCrawlDomain.findByIdAndUpdate(domainId, {
            $set: { status },
        });
    }

    async saveProductUrls(productUrls: string[], domainId: string) {
        const newProductUrlsEntry = new StaticCrawlProductUrl({
            domainId,
            urls: productUrls,
        });
        await newProductUrlsEntry.save();
    }
}

export const domainService = new DomainService();
