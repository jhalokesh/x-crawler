import request from 'supertest';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import app from '../src/app';
import { Config } from '../src/config';

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
            expect(
                response.body.crawlingOnDomains.validDomains.length
            ).toBeGreaterThan(0);
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
        it('should handle empty domain list and return 400 status code and appropriate error messages', async () => {
            const userInput = { domains: [] };
            const errorMsg = 'Please input valid domains';

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.length).toBeGreaterThan(0);
            expect(response.body.errors[0]).toHaveProperty('msg');
            expect(response.body.errors[0].msg).toBe(errorMsg);
            expect(response.statusCode).toBe(400);
        });
        it('should handle non-array domain input and return 400 status code and appropriate error messages', async () => {
            const userInput = {};
            const errorMsg =
                'Invalid input. Domains must be an array of strings.';

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.length).toBeGreaterThan(0);
            expect(response.body.errors[0]).toHaveProperty('msg');
            expect(response.body.errors[0].msg).toBe(errorMsg);
            expect(response.statusCode).toBe(400);
        });
        it('should handle oversized domain list and return 400 status code and appropriate error messages', async () => {
            const userInput = {
                domains: [
                    'amazon.com',
                    'flipkart.in',
                    'shop.myntra.com',
                    'store.ebay.co.uk',
                    'blog.store.flipkart.biz',
                    'sales.shopify.online',
                    'marketplace.amazon.shop',
                    'abc.def.example.store',
                    'app.market.co',
                    'my-ecommerce-platform.net',
                    'discounts-shop.org',
                    '-amazon.com',
                    'flipkart-.in',
                    'example..com',
                    'example',
                    'amazon.toolongtld',
                    'shop@amazon.com',
                    'store ebay.com',
                    'http://example.com',
                    'ftp://example.shop',
                    'example..shop.com',
                    'com',
                    'example.c',
                    'example_store.com',
                    'blog..shop.com',
                    '.example.com',
                    'example.com.',
                ],
            };
            const errorMsg = `Max ${Config.REQUEST_DOMAIN_COUNT} domains are allowed as input`;

            const response = await request(app)
                .post('/api/v1/crawl/static')
                .send(userInput);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.length).toBeGreaterThan(0);
            expect(response.body.errors[0]).toHaveProperty('msg');
            expect(response.body.errors[0].msg).toBe(errorMsg);
            expect(response.statusCode).toBe(400);
        });
    });
});
