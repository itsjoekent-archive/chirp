import createApiError from './create-api-error';
import getLanguageFromRequest from './get-language-from-request';
import { ServerValidationFunction } from './validate-request-body';
import { copy } from '@chirp/lib-utils';
import { fieldPreprocessors, fieldValidations } from '@chirp/lib-utils';
import { getFieldCopy } from '@chirp/lib-utils';

function genericValidationWrapper<ConfigType>(
  validationFunction: fieldValidations.ValidationFunctionType<ConfigType>
): ServerValidationFunction<ConfigType> {
  const innerValidationFunction: ServerValidationFunction<ConfigType> = (
    options
  ) => {
    const { request, logger, config } = options;

    const language = getLanguageFromRequest(request);
    const errorMessage = validationFunction({
      config,
      data: request.body,
      language,
      logger,
    });

    if (errorMessage) {
      throw createApiError(errorMessage);
    }
  };

  return innerValidationFunction;
}

export const isRequiredServerValidation =
  genericValidationWrapper<fieldValidations.IsRequiredValidationConfig>(
    fieldValidations.isRequiredValidation
  );
export const stringLengthServerValidation =
  genericValidationWrapper<fieldValidations.StringLengthValidationConfig>(
    fieldValidations.stringLengthValidation
  );
export const isValidEmailServerValidation =
  genericValidationWrapper<fieldValidations.IsValidEmailValidationConfig>(
    fieldValidations.isValidEmailValidation
  );
export const isValidHandleServerValidation =
  genericValidationWrapper<fieldValidations.IsValidHandleValidation>(
    fieldValidations.isValidHandleValidation
  );

type UniqueValidationConfig<
  PreprocessorFunctionValueType,
  PreprocessorFunctionReturnType
> = {
  field: string;
  documentKey?: string;
  collection: string;
  preprocessorFunction?: fieldPreprocessors.PreprocessorFunction<
    PreprocessorFunctionValueType,
    PreprocessorFunctionReturnType
  >;
};

type IsUniqueValidationParameterType<
  PreprocessorFunctionValueType,
  PreprocessorFunctionReturnType
> = Parameters<
  ServerValidationFunction<
    UniqueValidationConfig<
      PreprocessorFunctionValueType,
      PreprocessorFunctionReturnType
    >
  >
>[0];
type IsUniqueValidationReturnType<
  PreprocessorFunctionValueType,
  PreprocessorFunctionReturnType
> = ReturnType<
  ServerValidationFunction<
    UniqueValidationConfig<
      PreprocessorFunctionValueType,
      PreprocessorFunctionReturnType
    >
  >
>;

async function isUniqueValidationHelper<
  PreprocessorFunctionValueType = any,
  PreprocessorFunctionReturnType = string
>(
  options: IsUniqueValidationParameterType<
    PreprocessorFunctionValueType,
    PreprocessorFunctionReturnType
  >
): Promise<
  IsUniqueValidationReturnType<
    PreprocessorFunctionValueType,
    PreprocessorFunctionReturnType
  >
> {
  const { request, logger, config, mongoClient } = options;

  const { field, documentKey, collection, preprocessorFunction } = config;
  const data = request.body;

  const language = getLanguageFromRequest(request);
  const errorMessage = fieldValidations.isRequiredValidation({
    config: { key: field },
    data,
    language,
    logger,
  });

  if (errorMessage) {
    throw createApiError(errorMessage);
  }

  const raw = data[field];
  const value = preprocessorFunction ? preprocessorFunction(raw) : raw;

  const database = mongoClient.db('chirp');
  const queryResult = await database
    .collection(collection)
    .findOne({ [documentKey || field]: value });

  if (queryResult) {
    throw createApiError(
      copy.duplicateField[language]({
        field: getFieldCopy(field, language, logger),
      })
    );
  }
}

export const isUniqueHandleValidation: ServerValidationFunction<{}> = async (
  options
) =>
  isUniqueValidationHelper({
    ...options,
    config: {
      field: 'handle',
      collection: 'chirpers',
      preprocessorFunction: fieldPreprocessors.preprocessHandle,
    },
  });
export const isUniqueEmailValidation: ServerValidationFunction<{}> = async (
  options
) =>
  isUniqueValidationHelper({
    ...options,
    config: {
      field: 'email',
      collection: 'chirpers',
      preprocessorFunction: fieldPreprocessors.preprocessEmail,
    },
  });
