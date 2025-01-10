import { Model } from 'mongoose';
import { IDomainDocument, IProductUrlsDocument } from '../types';

export class DomainService<T extends IDomainDocument, U extends IProductUrlsDocument> {
    constructor(
        private domainModel: Model<T>,
        private productUrlModel: Model<U>
    ) {}

    // Upsert domain document and associate it with a job ID
    async upsertDomain(domain: string, groupId: string) {
        return await this.domainModel.findOneAndUpdate(
            { domain },
            { $addToSet: { jobId: groupId } },
            { new: true, upsert: true }
        );
    }

    async crawlDomainStatus(domainId: string, status: string) {
        await this.domainModel.findByIdAndUpdate(domainId, {
            $set: { status },
        });
    }

    async saveProductUrls(productUrls: string[], domainId: string) {
        const newProductUrlsEntry = new this.productUrlModel({
            domainId,
            urls: productUrls,
        });
        await newProductUrlsEntry.save();
    }
}
