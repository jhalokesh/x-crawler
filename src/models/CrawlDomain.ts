import mongoose, { Model, Schema } from 'mongoose';
import { CrawlDomainStatus, IDomainDocument } from '../types';

const createCrawlDomainSchema = (documentExpirationInSeconds: number): Schema<IDomainDocument> =>
    new Schema<IDomainDocument>(
        {
            domain: {
                type: String,
                required: true,
                unique: true,
            },
            jobId: {
                type: [String],
                default: [],
            },
            status: {
                type: String,
                enum: Object.values(CrawlDomainStatus),
                default: CrawlDomainStatus.PENDING,
            },
            expiresAt: {
                type: Date,
                default: () => new Date(Date.now() + documentExpirationInSeconds * 1000),
                expires: 0,
            }, // expires in 7 days | 60 * 60 * 24 * 7 = 604800
        },
        {
            timestamps: true,
        }
    );

// static crawl domain document expires in 7 days
export const StaticCrawlDomain: Model<IDomainDocument> = mongoose.model<IDomainDocument>(
    'StaticCrawlDomain',
    createCrawlDomainSchema(604800)
);

// dynamic crawl domain document expires in 7 days
export const DynamicCrawlDomain: Model<IDomainDocument> = mongoose.model<IDomainDocument>(
    'DynamicCrawlDomain',
    createCrawlDomainSchema(604800)
);
