import mongoose, { Schema } from 'mongoose';
import { IProductUrlsDocument } from '../types';

const StaticCrawlProductUrlSchema = new mongoose.Schema<IProductUrlsDocument>(
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
            default: () => new Date(Date.now() + 604800),
            expires: 0,
        }, // expires in 7 days | 60 * 60 * 24 * 7 = 604800
    },
    {
        timestamps: true,
    }
);

export const StaticCrawlProductUrl = mongoose.model<IProductUrlsDocument>(
    'StaticCrawlProductUrl',
    StaticCrawlProductUrlSchema
);
