import copy, { LanguageCode } from './copy';
import getFieldCopy from '@chirp/lib/utils/get-field-copy';

type ValidationConfig<T> = T;
type ValidationFunctionOptions<ConfigType> = {
  config: ConfigType;
  data: any;
  language: LanguageCode;
  logger: Chirp.UniversalLogger;
};

export type ValidationFunctionType<ConfigType> = (options: ValidationFunctionOptions<ConfigType>) => string | void;

function isDataObject(data: any): boolean {
  return typeof data === 'object' &&
    !Array.isArray(data) &&
    data !== null;
}

export type IsRequiredValidationConfig = ValidationConfig<{
  key: string;
}>;
export const isRequiredValidation: ValidationFunctionType<IsRequiredValidationConfig> = ({ config, data, language, logger }) => {
  const { key } = config;
  const fieldCopy = getFieldCopy(key, language, logger);
  const errorMessage = copy.missingField[language]({ field: fieldCopy });

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
  min?: number, 
  max?: number
}>;
export const stringLengthValidation: ValidationFunctionType<StringLengthValidationConfig> = ({ config, data, language, logger }) => {
  const { key, max, min } = config;
  const isRequiredError = isRequiredValidation({ config: { key }, data, language, logger });
  if (isRequiredError) return isRequiredError;

  const value = `${data[key]}`;

  if (typeof min === 'number') {
    if (value.length < min) {
      const fieldCopy = getFieldCopy(key, language, logger);
      const errorMessage = copy.minimumFieldLength[language]({ field: fieldCopy });

      return errorMessage;
    }
  }
};
