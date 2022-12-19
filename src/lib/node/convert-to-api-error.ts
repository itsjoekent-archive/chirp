import { v4 as uuid } from 'uuid';
import isApiErrorType from '@chirp/lib/node/is-api-error';
import copy, { defaultLanguageCode } from '@chirp/lib/utils/copy';

export default function convertToApiError(error: Chirp.ErrorApiResponse | Error | undefined): Chirp.ErrorApiResponse {
  if (!isApiErrorType(error)) {
    const apiError: Chirp.ErrorApiResponse = {
      error: {
        message: copy['genericServerError'][defaultLanguageCode](),
        messageCopyId: 'genericServerError',
        status: 400,
        serverErrorId: uuid(),
      }
    };

    return apiError;
  }

  return error as Chirp.ErrorApiResponse;
}
