import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { MongoClient } from 'mongodb';
import pinoHttp from 'pino-http';
import * as dotenv from 'dotenv'
import { createLogger } from '@chirp/lib-node';
import routes from './routes';

dotenv.config();
const isLocalDevelopment = process.env.IS_LOCAL_DEVELOPMENT === 'true';

(async function () {
  try {
    const logger = createLogger(isLocalDevelopment);

    const app = express();
    app.use(pinoHttp({ logger }));

    app.use(function (req, res, next) {
      res.setHeader('X-Powered-By', 'Chirp API Service');
      next();
    });

    app.use(
      cors({
        credentials: true,
        origin: `https://${process.env.API_DOMAIN}`,
      })
    );

    app.use(bodyParser.json());

    const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
    await mongoClient.connect();

    logger.info('Connected to Mongo');

    routes(app, logger, mongoClient);

    const PORT = process.env.API_PORT;
    app.listen(PORT, () => logger.info(`Listening on port:${PORT}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
