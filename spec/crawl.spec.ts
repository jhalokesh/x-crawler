import request from 'supertest';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import app from '../src/app';

describe('POST api/v1/crawl/static', () => {
    describe('Given all fields', () => {
        it('should return 200 status code for valid request', async () => {
            const userInput = {
                domains: [
                    'amazon.com',
                    'flipkart.in',
                    'shop.myntra.com',
                    'store.ebay.co.uk',
                    'example.c',
                    'example_store.com',
                    'blog..shop.com',
                    '.example.com',
                    'example.com.',
                ],
            };

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            expect(response.statusCode).toBe(200);
        });
        it('should return valid domains in the response', async () => {
            const userInput = {
                domains: [
                    'amazon.com',
                    'flipkart.in',
                    'shop.myntra.com',
                    'store.ebay.co.uk',
                    'example.c',
                    'example_store.com',
                    'blog..shop.com',
                    '.example.com',
                    'example.com.',
                ],
            };

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            expect(response.body).toHaveProperty('crawlingOnDomains');
            expect(response.body.crawlingOnDomains).toHaveProperty(
                'validDomains'
            );
        });
        it('should return invalid domains in the response', async () => {
            const userInput = {
                domains: [
                    'amazon.com',
                    'flipkart.in',
                    'shop.myntra.com',
                    'store.ebay.co.uk',
                    'example.c',
                    'example_store.com',
                    'blog..shop.com',
                    '.example.com',
                    'example.com.',
                ],
            };

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            expect(response.body).toHaveProperty('unableToCrawl');
            expect(response.body.unableToCrawl).toHaveProperty(
                'invalidDomains'
            );
        });
        it('should generate a unique job ID and validate uuidV4', async () => {
            const userInput = {
                domains: [
                    'amazon.com',
                    'flipkart.in',
                    'shop.myntra.com',
                    'store.ebay.co.uk',
                    'example.c',
                    'example_store.com',
                    'blog..shop.com',
                    '.example.com',
                    'example.com.',
                ],
            };

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            function uuidValidateV4(uuid: string) {
                return uuidValidate(uuid) && uuidVersion(uuid) === 4;
            }
            const uuidv4 = response.body.jobId;
            const isValidJobId = uuidValidateV4(uuidv4);

            expect(response.body).toHaveProperty('jobId');
            expect(isValidJobId).toBeTruthy();
        });
    });

    describe('Crawl endpoint error handling', () => {
        it.todo('should handle empty domain list');
        it.todo('should handle non-array domain input');
        it.todo('should handle oversized domain list');
        it.todo('should return appropriate error messages');
    });
});
