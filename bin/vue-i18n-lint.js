/* eslint-disable */
'use strict'
const cli = require('cac')()
const { createI18NReport, initCommand, useConfig } = require('../dist/vue-i18n-lint.umd.js')

cli
    .command('init', 'Create a default vue-i18n-lint config file')
    .action(initCommand)

cli
    .command('use-config [pathToFileWithOptions]', 'Use the config')
    .action(pathToFileWithOptions => {createI18NReport(useConfig(pathToFileWithOptions))})

cli.help()
cli.parse()