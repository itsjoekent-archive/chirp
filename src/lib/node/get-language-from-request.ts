import type { Request } from 'express';
import {
  defaultLanguageCode,
  supportedLanguages,
  LanguageCode,
} from '@chirp/lib/utils/copy';

export default function getLanguageFromRequest(request: Request): LanguageCode {
  const languageHeader = (request.get('Accept-Language') || '')
    .split(';')[0]
    .split(',');

  const match = languageHeader.find((languageCode) => {
    return (supportedLanguages as string[]).includes(languageCode);
  });

  return (match as LanguageCode) || defaultLanguageCode;
}
