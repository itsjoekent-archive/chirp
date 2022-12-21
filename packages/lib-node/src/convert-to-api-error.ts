import { v4 as uuid } from 'uuid';
import { copy } from '@chirp/lib-utils';
import { Chirp } from '@chirp/types';
import isApiErrorType from './is-api-error';

export default function convertToApiError(
  error: Chirp.ErrorApiResponse | Error | undefined
): Chirp.ErrorApiResponse {
  if (!isApiErrorType(error)) {
    const apiError: Chirp.ErrorApiResponse = {
      error: {
        message: copy['genericServerError'][copy.defaultLanguageCode](),
        status: 400,
        serverErrorId: uuid(),
      },
    };

    return apiError;
  }

  return error as Chirp.ErrorApiResponse;
}
