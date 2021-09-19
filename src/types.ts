export type CommandOptions = {
  usageFiles: string[];
  languageFiles: string;
}

export type TranslationUsageInfo = {
  name: string;
  path: string;
  fileContent: string;
}

export type TranslationKeyInfo = {
  line?: number;
  key: string;
  file?: string;
  language?: string;
}

export type TranslationKeyInfoWithBounding = TranslationKeyInfo & {
  previousCharacter: string;
  nextCharacter: string;
}

export type I18NLanguage = {
  [language: string]: TranslationKeyInfo[];
}

export type I18NReport = {
  missingKeys: TranslationKeyInfo[];
  unusedKeys: TranslationKeyInfo[];
  maybeDynamicKeys: TranslationKeyInfo[];
}
