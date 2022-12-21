import type { Request } from 'express';
import type { Logger } from 'pino';
import type { MongoClient } from 'mongodb';
import {
  isUniqueHandleValidation,
  isUniqueEmailValidation,
  isValidEmailServerValidation,
  isValidHandleServerValidation,
  stringLengthServerValidation,
} from './field-validations';
import { ServerValidationFunctionReturnType } from './validate-request-body';

type ServerValidationFunctionWrapper = (options: {
  request: Request;
  mongoClient: MongoClient;
  logger: Logger;
}) => ServerValidationFunctionReturnType;
type ServerValidationFunctionWrapperList = ServerValidationFunctionWrapper[];

const emptyConfig = {};

const fieldValidationGroups: Record<
  string,
  ServerValidationFunctionWrapperList
> = {
  name: [
    (options) =>
      stringLengthServerValidation({
        ...options,
        config: { key: 'name', min: 1, max: 50 },
      }),
  ],
  pronouns: [
    (options) =>
      stringLengthServerValidation({
        ...options,
        config: { key: 'name', min: 1, max: 25 },
      }),
  ],
  handle: [
    (options) =>
      stringLengthServerValidation({
        ...options,
        config: { key: 'name', min: 1, max: 16 },
      }),
    (options) => isValidHandleServerValidation({ ...options, config: { key: 'handle' } }),
    (options) => isUniqueHandleValidation({ ...options, config: emptyConfig }),
  ],
  email: [
    (options) =>
      isValidEmailServerValidation({ ...options, config: { key: 'email' } }),
    (options) => isUniqueEmailValidation({ ...options, config: emptyConfig }),
  ],
  password: [
    (options) =>
      stringLengthServerValidation({
        ...options,
        config: { key: 'password', min: 6, max: 32 },
      }),
  ],
};

type FieldValidationGroupKeys = keyof typeof fieldValidationGroups;
const fieldValidationGroupsTyped: Record<
  FieldValidationGroupKeys,
  ServerValidationFunctionWrapperList
> = { ...fieldValidationGroups };

export default fieldValidationGroupsTyped;
