import { parseLanguageFiles } from '../src/find-translations'

describe('find-translations.ts', () => {
  test('parseLanguageFiles', async () => {
    expect(await parseLanguageFiles(__dirname + '/fixtures/translations/messages.js')).toEqual({
      messages: [{
        file: "./tests/fixtures/translations/messages.js",
        line: 0,
        path: "en_GB.nested.hello",
      }, {
        file: "./tests/fixtures/translations/messages.js",
        line: 1,
        path: "en_GB.nested.deep.world",
      }, {
        file: "./tests/fixtures/translations/messages.js",
        line: 2,
        path: "ru_RU.nested.hello",
      }, {
        file: "./tests/fixtures/translations/messages.js",
        line: 3,
        path: "ru_RU.nested.deep.world",
      }]})
  })
})
