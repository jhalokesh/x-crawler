import request from 'supertest';
import app from '../src/app';

describe('POST /v1/crawl/static', () => {
    it('should return 200 status', async () => {
        const response = await request(app).post('/v1/crawl/static').send();
        expect(response.status).toBe(200);
    });
});
