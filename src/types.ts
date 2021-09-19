export type LintOptions = {
  usageFiles: string[];
  languageFiles: string;
}

export type LintReport = {
  missingKeys: UsageInfo[];
  unusedKeys: UsageInfo[];
  maybeDynamicKeys: UsageInfo[];
}

export type FileInfo = {
  name: string;
  path: string;
  content: string;
}

export type UsageInfo = {
  file?: string;
  line?: number;
  translation: string;
  language?: string;
}

export type UsageInfoWithBounding = UsageInfo & {
  previousCharacter: string;
  nextCharacter: string;
}

export type UsageStatistics = {
  [language: string]: UsageInfo[];
}
