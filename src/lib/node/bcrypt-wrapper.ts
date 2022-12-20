import { hash, compare } from 'bcrypt';

export async function hashPassword(passwordPlainText: string): Promise<string> {
  return hash(passwordPlainText, 10);
}

export async function comparePassword(hash: string, passwordPlainText: string): Promise<boolean> {
  return compare(passwordPlainText, hash);
}
