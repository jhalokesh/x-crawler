import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { Config } from './config';

const app = express();

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// * healthcheck
app.get('/v1/health-check', (req, res) => {
    res.status(200).json({ msg: 'Web crawler is running...' });
});

import crawlerRouter from './routes/crawlerRoutes';

app.use('/api/v1/crawl', crawlerRouter);

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const NODE_ENV = Config.NODE_ENV;
    // TODO - implement logger
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: NODE_ENV === 'development' || NODE_ENV === 'test' ? err.stack : '',
            },
        ],
    });
});

export default app;
