import path from 'path'
import fs from 'fs'
import defaultConfig from './vue-i18n-lint.config'
import {LintOptions} from '@/types'

const DEFAULT_PATH_TO_FILE_WITH_OPTIONS: string = './vue-i18n-lint.config.js'

export function initCommand(): void {
    fs.writeFileSync(
        path.resolve(process.cwd(), DEFAULT_PATH_TO_FILE_WITH_OPTIONS),
        `module.exports = ${JSON.stringify(defaultConfig, null, 4)}`,
    )
    console.log(`\u2705 Successful creation of the file '${DEFAULT_PATH_TO_FILE_WITH_OPTIONS}' with options!`)
}

export function useConfig (pathToFileWithOptions: string | null): LintOptions {
    let pathToConfigFile = path.resolve(process.cwd(), pathToFileWithOptions ?? DEFAULT_PATH_TO_FILE_WITH_OPTIONS)

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(pathToConfigFile)
}
