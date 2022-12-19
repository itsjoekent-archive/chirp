import type { Request } from 'express';
import { defaultLanguageCode, supportedLanguages, LanguageCode } from '@chirp/lib/utils/copy';

export default function getLanguageFromRequest(request: Request): LanguageCode {
  const languageHeader = request.get('Accept-Language') || '';
  if ((supportedLanguages as string[]).includes(languageHeader)) {
    return languageHeader as LanguageCode;
  }

  return defaultLanguageCode;
}
