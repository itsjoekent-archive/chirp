import type { Application } from 'express';
import { Router } from 'express';
import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import getLanguageFromRequest from '@chirp/lib/node/get-language-from-request';
import routeWrapper from '@chirp/lib/node/route-wrapper';
import { Chirp } from '@chirp/types/shared/chirp';
import postChirper from './post-chirper';

// ⬇️ Add new routes here ⬇️
// -------------------
const routes: Chirp.RequestDefinition[] = [postChirper];

export default function setupRoutes(
  app: Application,
  logger: Logger,
  mongoClient: MongoClient
) {
  const router = Router();
  app.use('/api/v1', router);

  app.use((request, response) => {
    const language = getLanguageFromRequest(request);
    response.set('Content-Language', language);
  });

  const routeWrapperGenerator = (routeDefinition: Chirp.RequestDefinition) =>
    routeWrapper(router, routeDefinition, logger, mongoClient);

  routes.forEach((route) => routeWrapperGenerator(route));
}
