import ISO6391 from 'iso-639-1';

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export const getAllLanguages = (): Language[] => {
  return ISO6391.getAllCodes().map(code => ({
    code,
    name: ISO6391.getName(code),
    nativeName: ISO6391.getNativeName(code)
  }));
};

export const getLanguageByCode = (code: string): Language | null => {
  if (!ISO6391.validate(code)) return null;
  
  return {
    code,
    name: ISO6391.getName(code),
    nativeName: ISO6391.getNativeName(code)
  };
};

export const formatLanguageLabel = (name: string, code: string): string => {
  return `${name} (${code})`;
};