type LanguageCode = 'en-US';
const supportedLanguages: LanguageCode[] = ['en-US'];

type DictionaryEntry = { [code in LanguageCode]: (tokens?: any) => string };

function pluralize(count: number, singular: string = '', plural: string = 's') {
  return count === 1 ? singular : plural;
}

const copy: Record<string, DictionaryEntry> = {
  // errors
  genericServerError: {
    'en-US': () => 'Encountered an unexpected error',
  },

  // validations
  missingField: {
    'en-US': (tokens: { field: string }) => `${tokens.field} is required`,
  },
  minimumFieldLength: {
    'en-US': (tokens: { field: string, minLength: number }) => `${tokens.field} must have at least ${tokens.field} character${pluralize(tokens.minLength)}`,
  },

  // fields
  emailField: {
    'en-US': () => 'email',
  },
};

type CopyKeys = keyof typeof copy;
const copyTyped: Record<CopyKeys, DictionaryEntry> = { ...copy };

const defaultLanguageCode: LanguageCode = 'en-US';

export { defaultLanguageCode, supportedLanguages, CopyKeys, LanguageCode };
export default copyTyped;
