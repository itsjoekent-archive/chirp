import copy, { LanguageCode } from '@chirp/lib/utils/copy';

export default function getFieldCopy(fieldKey: string, language: LanguageCode, logger: Chirp.UniversalLogger) {
  const fieldCopyKey = `${fieldKey}Field`;
  const fieldCopy = fieldCopyKey in copy ? copy[fieldCopyKey][language]() : '';

  if (!fieldCopy) {
    logger.error(`Missing copy for field: "${fieldKey}"`);
  }

  return fieldCopy;
}