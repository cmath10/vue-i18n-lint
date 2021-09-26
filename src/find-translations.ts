import Dot from 'dot-object'
import fs from 'fs'
import glob from 'glob'
import isValidGlob from 'is-valid-glob'
import path from 'path'
import yaml from 'js-yaml'

import compile from '@/compile'
import {
  FileInfo,
  UsageInfo,
  UsageStatistics,
} from '@/types'

export function readFiles (src: string): Promise<FileInfo>[] {
  if (!isValidGlob(src)) {
    throw new Error(`languageFiles isn't a valid glob pattern.`)
  }

  const targetFiles = glob.sync(src)

  if (targetFiles.length === 0) {
    throw new Error('languageFiles glob has no files.')
  }

  return targetFiles.map(async function (filePath) {
    const langPath = path.resolve(process.cwd(), filePath)

    const extension = langPath.substring(langPath.lastIndexOf('.')).toLowerCase()

    const isJSON = extension === '.json'
    const isYAML = extension === '.yaml' || extension === '.yml'

    let langObj
    if (isJSON) {
      langObj = JSON.parse(fs.readFileSync(langPath, 'utf8'))
    } else if (isYAML) {
      langObj = yaml.load(fs.readFileSync(langPath, 'utf8'))
    } else {
      langObj = eval(await compile(langPath))
    }

    return {
      name: filePath.replace(process.cwd(), '.'),
      path: filePath,
      content: JSON.stringify(langObj),
    }
  })
}

export function extractI18NLanguageFromLanguageFiles (languageFiles: FileInfo[], dot: DotObject.Dot = Dot): UsageStatistics {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.'));

    if (!accumulator[language]) {
      accumulator[language] = [];
    }

    const flattenedObject = dot.dot(JSON.parse(file.content))
    Object.keys(flattenedObject).forEach((key, index) => {
      accumulator[language].push({
        path: key,
        file: file.name,
        line: index,
      })
    })

    return accumulator
  }, {});
}

export function writeMissingToLanguageFiles (parsedLanguageFiles: FileInfo[], missingKeys: UsageInfo[], dot: DotObject.Dot = Dot): void {
  parsedLanguageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content);

    missingKeys.forEach(item => {
      if (item.language && languageFile.name.includes(item.language) || !item.language) {
        dot.str(item.translation, '', languageFileContent);
      }
    })

    writeLanguageFile(languageFile, languageFileContent)
  })
}

export function removeUnusedFromLanguageFiles (parsedLanguageFiles: FileInfo[], unusedKeys: UsageInfo[], dot: DotObject.Dot = Dot): void {
  parsedLanguageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content)

    unusedKeys.forEach(item => {
      if (item.language && languageFile.name.includes(item.language)) {
        dot.delete(item.translation, languageFileContent)
      }
    })

    writeLanguageFile(languageFile, languageFileContent)
  })
}

function writeLanguageFile (languageFile: FileInfo, newLanguageFileContent: unknown) {
  const filePath = languageFile.path
  const fileExtension = languageFile.name.substring(languageFile.name.lastIndexOf('.') + 1)

  const content = JSON.stringify(newLanguageFileContent, null, 2)

  if (fileExtension === 'json') {
    fs.writeFileSync(filePath, content)
  } else if (fileExtension === 'js') {
    fs.writeFileSync(filePath, `module.exports = ${content}; \n`)
  } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
    fs.writeFileSync(filePath, yaml.dump(newLanguageFileContent))
  } else {
    throw new Error(`Language filetype of ${fileExtension} not supported.`)
  }
}

// This is a convenience function for users implementing in their own projects, and isn't used internally
export function parseLanguageFiles (languageFiles: string, dot: DotObject.Dot = Dot): Promise<UsageStatistics | undefined> {
  return new Promise(resolve => {
    Promise.all(readFiles(languageFiles)).then(results => {
      resolve(extractI18NLanguageFromLanguageFiles(results, dot))
    }).catch(() => {
      resolve(undefined)
    })
  })
}
