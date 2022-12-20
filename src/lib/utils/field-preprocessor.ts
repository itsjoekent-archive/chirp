export type PreprocessorFunction<ValueType = any, ReturnType = string> = (value: ValueType) => ReturnType;

export const preprocessName: PreprocessorFunction = (value) => {
  return `${value}`.trim();
};

export const preprocessPronouns: PreprocessorFunction = (value) => {
  return `${value}`.trim().toLowerCase();
};

export const preprocessHandle: PreprocessorFunction = (value) => {
  return `${value}`.toLowerCase().trim();
};

export const preprocessEmail: PreprocessorFunction = (value) => {
  return `${value}`.toLowerCase().trim();
};
