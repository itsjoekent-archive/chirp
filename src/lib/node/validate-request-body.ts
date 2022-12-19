import type { Request } from 'express';
import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';

type ServerValidationReturnType = Chirp.ErrorApiResponse | void;
export type ServerValidationFunction<Config = void> = (options: {
  request: Request;
  mongoClient: MongoClient;
  logger: Logger;
  config: Config;
}) => Promise<ServerValidationReturnType> | ServerValidationReturnType;

export default async function validateRequestBody<ParsedBodyType>(
  request: Request,
  mongoClient: MongoClient,
  logger: Logger,
  validations: [ServerValidationFunction<any>, any][],
): Promise<ParsedBodyType> {
  const { body } = request;

  for (const validation of validations) {
    const [validationFunction, config] = validation;
    await validationFunction({ request, mongoClient, logger, config });
  }

  return body as ParsedBodyType;
}
