import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { Config } from './config';

const app = express();

app.get('/', (req, res) => {
    res.send('Web crawler is running...');
});

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const NODE_ENV = Config.NODE_ENV;
    // TODO - implement logger
    console.log(err.message);
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location:
                    NODE_ENV === 'development' || NODE_ENV === 'test'
                        ? err.stack
                        : '',
            },
        ],
    });
});

export default app;
