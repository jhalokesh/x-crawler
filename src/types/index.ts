import { Document, Types } from 'mongoose';

// interface representing the document in MongoDB
export interface IDomainDocument {
    domain: string;
    jobId: string[];
    expiresAt: Date;
}

export interface IProductUrlsDocument extends Document {
    urls: string[];
    domainId: Types.ObjectId; // Reference to Domain model; createdBy
    expiresAt: Date;
}
