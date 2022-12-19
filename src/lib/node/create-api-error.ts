import { v4 as uuid } from 'uuid';

export default function createApiError(message: string, status: number = 400): Chirp.ErrorApiResponse {
  return {
    error: {
      message,
      status,
      serverErrorId: uuid(),
    },
  };
}
