import type { Application } from 'express';
import { Router } from 'express';
import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import routeWrapper from '@chirp/lib/node/route-wrapper';
import postChirper from './post-chirper';

// ⬇️ Add new routes here ⬇️
// -------------------
const routes: Chirp.RequestDefinition[] = [
  postChirper,
];

export default function setupRoutes(
  app: Application,
  logger: Logger,
  mongoClient: MongoClient,
) {
  const router = Router();
  app.use('/v1', router);

  const routeWrapperGenerator = (routeDefinition: Chirp.RequestDefinition) => 
    routeWrapper(router, routeDefinition, logger, mongoClient);

  routes.forEach((route) => routeWrapperGenerator(route));
}
