import cors from 'cors';
import express from 'express';
import { MongoClient } from 'mongodb';
import pinoHttp from 'pino-http';
import createLogger from '@chirp/lib/node/create-logger'; 

(async function () {
  try {
    const logger = createLogger();

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
    
    const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
    await mongoClient.connect();

    const database = mongoClient.db('chirp');

    const PORT = process.env.API_PORT;
    app.listen(PORT, () => logger.info(`Listening on port:${PORT}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  } 
})();