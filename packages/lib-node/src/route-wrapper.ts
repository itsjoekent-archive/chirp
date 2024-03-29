import type { Router } from 'express';
import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import convertToApiError from './convert-to-api-error';
import { Chirp } from '@chirp/types';

export default async function routeWrapper(
  router: Router,
  requestDefinition: Chirp.RequestDefinition,
  logger: Logger,
  mongoClient: MongoClient
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

      const {
        error: { status },
      } = apiError;
      if (status >= 500) {
        const message =
          error?.stack ||
          error?.message ||
          error?.error?.message ||
          new Error().stack;
        logger.error(
          `[Api Error ID: ${apiError.error.serverErrorId}] ${message}`
        );
      }

      response.status(status).json(apiError);
    }
  });
}
