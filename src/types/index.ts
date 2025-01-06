import { Request } from 'express';
import { Document, Types } from 'mongoose';

export enum CrawlDomainStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}
// interface representing the domain document in MongoDB
export interface IDomainDocument {
    domain: string;
    jobId: string[];
    status: CrawlDomainStatus;
    expiresAt: Date;
}

// interface representing the domain document in MongoDB
export interface IProductUrlsDocument extends Document {
    urls: string[];
    domainId: Types.ObjectId; // Reference to Domain model; createdBy
    expiresAt: Date;
}

export interface IRequestWithDomain extends Request {
    validDomains?: string[];
    invalidDomains?: string[];
}
