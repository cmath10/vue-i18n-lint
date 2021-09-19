import {TranslationUsageInfo, TranslationKeyInfoWithBounding} from './types';
import isValidGlob from 'is-valid-glob';
import glob from 'glob';
import fs from 'fs';

export function readVueFiles (src: string): TranslationUsageInfo[] {
  if (!isValidGlob(src)) {
    throw new Error(`vueFiles isn't a valid glob pattern.`);
  }

  const targetFiles = glob.sync(src);

  if (targetFiles.length === 0) {
    throw new Error('vueFiles glob has no files.');
  }

  return targetFiles.map(f => {
    const fileName = f.replace(process.cwd(), '.');
    return { name: fileName, path: f, fileContent: fs.readFileSync(f, 'utf8') };
  });
}

function* getMatches (file: TranslationUsageInfo, regExp: RegExp, captureGroup = 1): IterableIterator<TranslationKeyInfoWithBounding> {
  while (true) {
    const match = regExp.exec(file.fileContent);
    if (match === null) {
      break;
    }
    const key = match[captureGroup];

    const pathAtIndex = file.fileContent.indexOf(key);
    const previousCharacter = file.fileContent.charAt(pathAtIndex - 1);
    const nextCharacter = file.fileContent.charAt(pathAtIndex + key.length);

    const line = (file.fileContent.substring(0, match.index).match(/\n/g) || []).length + 1;
    yield {
      key,
      previousCharacter,
      nextCharacter,
      file: file.name,
      line,
    };
  }
}

/**
 * Extracts translation keys from methods such as `$t` and `$tc`.
 *
 * - **regexp pattern**: (?:[$ .]tc?)\(
 *
 *   **description**: Matches the sequence t( or tc(, optionally with either “$”, “.” or “ ” in front of it.
 *
 * - **regexp pattern**: (["'`])
 *
 *   **description**: 1. capturing group. Matches either “"”, “'”, or “`”.
 *
 * - **regexp pattern**: ((?:[^\\]|\\.)*?)
 *
 *   **description**: 2. capturing group. Matches anything except a backslash
 *   *or* matches any backslash followed by any character (e.g. “\"”, “\`”, “\t”, etc.)
 *
 * - **regexp pattern**: \1
 *
 *   **description**: matches whatever was matched by capturing group 1 (e.g. the starting string character)
 *
 * @param file a file object
 * @returns a list of translation keys found in `file`.
 */
function extractMethodMatches (file: TranslationUsageInfo): TranslationKeyInfoWithBounding[] {
  const methodRegExp = /(?:[$ ."'`]t[cm]?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g;
  return [ ...getMatches(file, methodRegExp, 2) ];
}

function extractComponentMatches (file: TranslationUsageInfo): TranslationKeyInfoWithBounding[] {
  const componentRegExp = /(?:<(?:i18n|Translation))(?:.|\n)*?(?:[^:]path=("|'))((?:[^\\]|\\.)*?)\1/gi;
  return [ ...getMatches(file, componentRegExp, 2) ];
}

function extractDirectiveMatches (file: TranslationUsageInfo): TranslationKeyInfoWithBounding[] {
  const directiveRegExp = /v-t="'((?:[^\\]|\\.)*?)'"/g;
  return [ ...getMatches(file, directiveRegExp) ];
}

export function extractI18NItemsFromVueFiles (sourceFiles: TranslationUsageInfo[]): TranslationKeyInfoWithBounding[] {
  return sourceFiles.reduce((accumulator, file) => {
    const methodMatches = extractMethodMatches(file);
    const componentMatches = extractComponentMatches(file);
    const directiveMatches = extractDirectiveMatches(file);
    return [
      ...accumulator,
      ...methodMatches,
      ...componentMatches,
      ...directiveMatches,
    ];
  }, [] as TranslationKeyInfoWithBounding[]);
}

// This is a convenience function for users implementing in their own projects, and isn't used internally
export function parseVueFiles (vueFiles: string): TranslationKeyInfoWithBounding[] {
  return extractI18NItemsFromVueFiles(readVueFiles(vueFiles));
}
