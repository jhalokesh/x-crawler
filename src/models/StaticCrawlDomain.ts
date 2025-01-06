import mongoose from 'mongoose';
import { CrawlDomainStatus, IDomainDocument } from '../types';

const StaticCrawlDomainSchema = new mongoose.Schema<IDomainDocument>(
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
            default: () => new Date(Date.now() + 604800),
            expires: 0,
        }, // expires in 7 days | 60 * 60 * 24 * 7 = 604800
    },
    {
        timestamps: true,
    }
);

export const StaticCrawlDomain = mongoose.model<IDomainDocument>(
    'StaticCrawlDomain',
    StaticCrawlDomainSchema
);
