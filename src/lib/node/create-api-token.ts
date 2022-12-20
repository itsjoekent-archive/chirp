import { randomBytes } from 'crypto';
import ms from 'ms';
import { Chirp } from '@chirp/types/shared/chirp';

export default function createApiToken(expiresIn: string = '1 month'): Chirp.ApiToken {
  const expiresAt = new Date(ms(expiresIn) + Date.now()).toUTCString();
  const value = randomBytes(32).toString('utf-8');

  return { expiresAt, value };
}
