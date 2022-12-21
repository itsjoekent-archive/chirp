import { Chirp } from '@chirp/types';
import {
  LanguageCode,
  missingField,
  minimumFieldLength,
  maximumFieldLength,
  invalidEmailFormat,
} from './copy';
import { preprocessEmail } from './field-preprocessor';
import getFieldCopy from './get-field-copy';

type ValidationConfig<T> = T;
type ValidationFunctionOptions<ConfigType> = {
  config: ConfigType;
  data: any;
  language: LanguageCode;
  logger: Chirp.UniversalLogger;
};

export type ValidationFunctionType<ConfigType> = (
  options: ValidationFunctionOptions<ConfigType>
) => string | void;

function isDataObject(data: any): boolean {
  return typeof data === 'object' && !Array.isArray(data) && data !== null;
}

export type IsRequiredValidationConfig = ValidationConfig<{
  key: string;
}>;
export const isRequiredValidation: ValidationFunctionType<
  IsRequiredValidationConfig
> = ({ config, data, language, logger }) => {
  const { key } = config;

  const fieldCopy = getFieldCopy(key, language, logger);
  const errorMessage = missingField[language]({ field: fieldCopy });

  if (!isDataObject(data)) {
    return errorMessage;
  }

  const value = data[key];
  const valueType = typeof value;

  if (['undefined', 'null'].includes(valueType)) {
    return errorMessage;
  }
};

export type StringLengthValidationConfig = ValidationConfig<{
  key: string;
  min?: number;
  max?: number;
}>;
export const stringLengthValidation: ValidationFunctionType<
  StringLengthValidationConfig
> = ({ config, data, language, logger }) => {
  const { key, max, min } = config;

  const isRequiredError = isRequiredValidation({
    config: { key },
    data,
    language,
    logger,
  });
  if (isRequiredError) return isRequiredError;

  const value = `${data[key]}`.trim();

  if (typeof min === 'number') {
    if (value.length < min) {
      const fieldCopy = getFieldCopy(key, language, logger);
      const errorMessage = minimumFieldLength[language]({
        field: fieldCopy,
        minLength: min,
      });

      return errorMessage;
    }
  }

  if (typeof max === 'number') {
    if (value.length > max) {
      const fieldCopy = getFieldCopy(key, language, logger);
      const errorMessage = maximumFieldLength[language]({
        field: fieldCopy,
        maxLength: max,
      });

      return errorMessage;
    }
  }
};

export type IsValidEmailValidationConfig = ValidationConfig<{
  key: string;
}>;
export const isValidEmailValidation: ValidationFunctionType<
  IsValidEmailValidationConfig
> = ({ config, data, language, logger }) => {
  const { key } = config;

  const isRequiredError = isRequiredValidation({
    config: { key },
    data,
    language,
    logger,
  });
  if (isRequiredError) return isRequiredError;

  const email = preprocessEmail(data[key]);

  // regex stolen from here:
  // https://stackoverflow.com/a/46181
  const isValid = email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!isValid) {
    return invalidEmailFormat[language]();
  }
};
