import createApiError from '@chirp/lib/node/create-api-error';
import getLanguageFromRequest from '@chirp/lib/node/get-language-from-request';
import { ServerValidationFunction } from '@chirp/lib/node/validate-request-body';
import {
  ValidationFunctionType,
  isRequiredValidation, 
  IsRequiredValidationConfig,
  stringLengthValidation,
  StringLengthValidationConfig,
} from '@chirp/lib/utils/field-validations';

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

// Can still do custom validations
