export type LanguageCode = 'en-US';
export const supportedLanguages: LanguageCode[] = ['en-US'];

type CopyDictionaryEntry<Tokens = any> = { [code in LanguageCode]: (tokens: Tokens) => string };
type CopyDictionaryEntryStatic = { [code in LanguageCode]: () => string };

function pluralize(count: number, singular: string = '', plural: string = 's') {
  return count === 1 ? singular : plural;
}

export const genericServerError: CopyDictionaryEntryStatic = {
  'en-US': () => 'Encountered an unexpected error',
};

type MissingFieldTokens = { field: string };
export const missingField: CopyDictionaryEntry<MissingFieldTokens> = {
  'en-US': (tokens: { field: string }) => `${tokens.field} is required`,
};

type MinimumFieldLengthTokens = { field: string, minLength: number };
export const minimumFieldLength: CopyDictionaryEntry<MinimumFieldLengthTokens> = {
  'en-US': (tokens: { field: string, minLength: number }) => `${tokens.field} must have at least ${tokens.field} character${pluralize(tokens.minLength)}`,
};

type MaximumFieldLengthTokens = { field: string, maxLength: number };
export const maximumFieldLength: CopyDictionaryEntry<MaximumFieldLengthTokens> = {
  'en-US': (tokens: { field: string, maxLength: number }) => `${tokens.field} can not have more than ${tokens.field} character${pluralize(tokens.maxLength)}`,
};

type DuplicateFieldTokens = { field: string };
export const duplicateField: CopyDictionaryEntry<DuplicateFieldTokens> = {
  'en-US': (tokens) => `${tokens.field} is already in use.`,
};

export const invalidEmailFormat: CopyDictionaryEntryStatic = {
  'en-US': () => 'Invalid email format.',
};

export const handleField: CopyDictionaryEntryStatic = {
  'en-US': () => 'handle',
};

export const nameField: CopyDictionaryEntryStatic = {
  'en-US': () => 'name',
};

export const pronounsField: CopyDictionaryEntryStatic = {
  'en-US': () => 'pronouns',
};

export const emailField: CopyDictionaryEntryStatic = {
  'en-US': () => 'email',
};

export const passwordField: CopyDictionaryEntryStatic = {
  'en-US': () => 'password',
};

const copy: Record<string, CopyDictionaryEntry | CopyDictionaryEntryStatic> = {
  // errors
  genericServerError,

  // validations
  missingField,
  minimumFieldLength,
  maximumFieldLength,
  duplicateField,

  // fields
  handleField,
  nameField,
  pronounsField,
  emailField,
  passwordField,
};

export type CopyKeys = keyof typeof copy;
const copyTyped: Record<CopyKeys, CopyDictionaryEntry> = { ...copy };

export const defaultLanguageCode: LanguageCode = 'en-US';
export default copyTyped;
