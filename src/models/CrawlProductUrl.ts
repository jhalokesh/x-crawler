import mongoose, { Model, Schema } from 'mongoose';
import { IProductUrlsDocument } from '../types';

const createCrawlProductUrlSchema = (
    documentExpirationInSeconds: number
): Schema<IProductUrlsDocument> =>
    new Schema<IProductUrlsDocument>(
        {
            urls: {
                type: [String],
                required: true,
                validate: {
                    validator: function (v: string[]) {
                        return v.length > 0;
                    },
                    message: 'URLs array cannot be empty',
                },
            },
            domainId: {
                type: Schema.Types.ObjectId,
                ref: 'Domain',
                required: true,
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
export const StaticCrawlProductUrl: Model<IProductUrlsDocument> =
    mongoose.model<IProductUrlsDocument>(
        'StaticCrawlProductUrl',
        createCrawlProductUrlSchema(604800)
    );

// dynamic crawl domain document expires in 7 days
export const DynamicCrawlProductUrl: Model<IProductUrlsDocument> =
    mongoose.model<IProductUrlsDocument>(
        'DynamicCrawlProductUrl',
        createCrawlProductUrlSchema(604800)
    );
