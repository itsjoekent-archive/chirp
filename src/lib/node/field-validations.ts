import createApiError from '@chirp/lib/node/create-api-error';
import getLanguageFromRequest from '@chirp/lib/node/get-language-from-request';
import { ServerValidationFunction } from '@chirp/lib/node/validate-request-body';
import { duplicateField } from '@chirp/lib/utils/copy';
import { PreprocessorFunction, preprocessHandle, preprocessEmail } from '@chirp/lib/utils/field-preprocessor';
import {
  ValidationFunctionType,
  isRequiredValidation, 
  IsRequiredValidationConfig,
  isValidEmailValidation,
  IsValidEmailValidationConfig,
  stringLengthValidation,
  StringLengthValidationConfig,
} from '@chirp/lib/utils/field-validations';
import getFieldCopy from '@chirp/lib/utils/get-field-copy';

function genericValidationWrapper<ConfigType>(validationFunction: ValidationFunctionType<ConfigType>): ServerValidationFunction<ConfigType> {
  const innerValidationFunction: ServerValidationFunction<ConfigType> = (options) => {
    const {
      request,
      logger,
      config,
    } = options;

    const language = getLanguageFromRequest(request);
    const errorMessage = validationFunction({
      config, data: request.body, language, logger,
    });

    if (errorMessage) {
      throw createApiError(errorMessage);
    }
  };

  return innerValidationFunction;
};

export const isRequiredServerValidation = genericValidationWrapper<IsRequiredValidationConfig>(isRequiredValidation);
export const stringLengthServerValidation = genericValidationWrapper<StringLengthValidationConfig>(stringLengthValidation);
export const isValidEmailServerValidation = genericValidationWrapper<IsValidEmailValidationConfig>(isValidEmailValidation);

type UniqueValidationConfig<PreprocessorFunctionValueType, PreprocessorFunctionReturnType> = {
  field: string;
  documentKey?: string;
  collection: string;
  preprocessorFunction?: PreprocessorFunction<PreprocessorFunctionValueType, PreprocessorFunctionReturnType>;
};

type IsUniqueHandleValidationParameterType<PreprocessorFunctionValueType, PreprocessorFunctionReturnType> = Parameters<ServerValidationFunction<UniqueValidationConfig<PreprocessorFunctionValueType, PreprocessorFunctionReturnType>>>[0];
type IsUniqueHandleValidationReturnType<PreprocessorFunctionValueType, PreprocessorFunctionReturnType> = ReturnType<ServerValidationFunction<UniqueValidationConfig<PreprocessorFunctionValueType, PreprocessorFunctionReturnType>>>;

async function isUniqueHandleValidationHelper<PreprocessorFunctionValueType = any, PreprocessorFunctionReturnType = string>(options: IsUniqueHandleValidationParameterType<PreprocessorFunctionValueType, PreprocessorFunctionReturnType>): Promise<IsUniqueHandleValidationReturnType<PreprocessorFunctionValueType, PreprocessorFunctionReturnType>> {
  const {
    request,
    logger,
    config,
    mongoClient,
  } = options;

  const { field, documentKey, collection, preprocessorFunction } = config;
  const data = request.body;

  const language = getLanguageFromRequest(request);
  const errorMessage = isRequiredValidation({
    config: { key: field }, data, language, logger,
  });

  if (errorMessage) {
    throw createApiError(errorMessage);
  }

  const raw = data[field];
  const value = preprocessorFunction ? preprocessorFunction(raw) : raw;

  const database = mongoClient.db('chirp');
  const queryResult = await database.collection(collection).findOne({ [documentKey || field]: value });

  if (queryResult) {
    throw createApiError(duplicateField[language]({
      field: getFieldCopy(field, language, logger),
    }));
  }
}

export const isUniqueHandleValidation: ServerValidationFunction<{}> = async (options) => isUniqueHandleValidationHelper({ ...options, config: { field: 'handle', collection: 'chirpers', preprocessorFunction: preprocessHandle } });
export const isUniqueEmailValidation: ServerValidationFunction<{}> = async (options) => isUniqueHandleValidationHelper({ ...options, config: { field: 'email', collection: 'chirpers', preprocessorFunction: preprocessEmail } });
