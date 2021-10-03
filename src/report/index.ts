import { LintOptions } from '@/types'

export async function createI18NReport (options: LintOptions): Promise<string> {
    const {
        usageFiles,
        languageFiles,
    } = options

    if (!usageFiles) throw new Error('Required configuration usageFiles is missing.')
    if (!usageFiles) throw new Error('Required configuration languageFiles is missing.')

    const report = 'OK'

    return report
}
