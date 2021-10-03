export * from './config-file'
export * from './report'
export * from './types'

process.on('uncaughtException', (error) => {
    console.error('\u274C [vue-i18n-lint]', error)
    process.exit(1)
})

process.on('unhandledRejection', (error) => {
    console.error('\u274C [vue-i18n-lint]', error)
    process.exit(1)
})
