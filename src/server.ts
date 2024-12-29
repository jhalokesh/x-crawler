import app from './app';
import { Config } from './config';

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => console.log('Server running', { port: PORT }));
    } catch (err) {
        if (err instanceof Error) {
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
        process.exit(1);
    }
};

startServer();
