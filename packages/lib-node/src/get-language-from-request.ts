import type { Request } from 'express';
import { copy } from '@chirp/lib-utils';

export default function getLanguageFromRequest(
  request: Request
): copy.LanguageCode {
  const languageHeader = (request.get('Accept-Language') || '')
    .split(';')[0]
    .split(',');

  const match = languageHeader.find((languageCode) => {
    return (copy.supportedLanguages as string[]).includes(languageCode);
  });

  return (match as copy.LanguageCode) || copy.defaultLanguageCode;
}
