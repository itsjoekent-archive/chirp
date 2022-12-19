import type { Router } from 'express';
import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import convertToApiError from '@chirp/lib/node/convert-to-api-error';

export default async function routeWrapper(
  router: Router, 
  requestDefinition: Chirp.RequestDefinition,
  logger: Logger,
  mongoClient: MongoClient,
) {
  const { handler, method, path } = requestDefinition;

  router[method](path, async (request, response) => {
    try {
      await handler({
        logger,
        mongoClient,
        request,
        response,
      });
    } catch (error: any) {
      const apiError = convertToApiError(error);
      const message = error?.stack || error?.message || error?.error?.message || new Error().stack;

      const { error: { status } } = apiError;
      if (status >= 500) {
        logger.error(`[Api Error ID: ${apiError.error.serverErrorId}] ${message}`);
      }
      
      response.status(status).json(apiError);
    }
  });
}
