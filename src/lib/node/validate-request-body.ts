import type { Request } from 'express';
import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import { Chirp } from '@chirp/types/shared/chirp';

export type ServerValidationReturnType = Chirp.ErrorApiResponse | void;
export type ServerValidationFunctionReturnType = Promise<ServerValidationReturnType> | ServerValidationReturnType;

type ServerValidationFunctionBaseOptions = {
  request: Request;
  mongoClient: MongoClient;
  logger: Logger;
};

export type ServerValidationFunction<Config> = (options: ServerValidationFunctionBaseOptions & {
  config: Config;
}) => ServerValidationFunctionReturnType

export default async function validateRequestBody<ParsedBodyType>(
  request: Request,
  mongoClient: MongoClient,
  logger: Logger,
  validations: ((baseOptions: ServerValidationFunctionBaseOptions) => ReturnType<ServerValidationFunction<any>>)[],
): Promise<ParsedBodyType> {
  const { body } = request;

  for (const validationFunction of validations) {
    await validationFunction({ request, mongoClient, logger });
  }

  return body as ParsedBodyType;
}
