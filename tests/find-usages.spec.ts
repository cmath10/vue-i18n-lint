import path from 'path'
import { readFiles, parseFiles } from '../src/find-usages'

describe('find-usages.ts', () => {
  describe('parseUsageFiles', () => {
    test('parses files with valid glob pattern', () => {
      expect(parseFiles(path.resolve(__dirname, './fixtures/usages/test-read/*.vue'))).toEqual([{
        translation: 'header.title',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 3,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        translation: 'header.title2',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 4,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        file: './tests/fixtures/usages/test-read/basic.vue',
        translation: 'content.paragraph.p_1',
        line: 5,
        previousCharacter: '"',
        nextCharacter: '"',
      }, {
        translation: 'Key used as default translation. Second sentence.',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 6,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        translation: 'content.paragraph.p.2',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 7,
        previousCharacter: '`',
        nextCharacter: '`',
      }, {
        translation: 'content.link.b',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 9,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        translation: 'content.link.b',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 12,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        translation: 'content.link.b',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 15,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        translation: 'header.title',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 18,
        previousCharacter: "'",
        nextCharacter: "'",
      }, {
        translation: 'content.link.a',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 8,
        previousCharacter: '"',
        nextCharacter: '"',
      }, {
        translation: 'content.link.a',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 11,
        previousCharacter: '"',
        nextCharacter: '"',
      }, {
        translation: 'content.link.a',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 14,
        previousCharacter: '"',
        nextCharacter: '"',
      }, {
        translation: 'header.title',
        file: './tests/fixtures/usages/test-read/basic.vue',
        line: 17,
        previousCharacter: "'",
        nextCharacter: "'",
      }])
    })
  })

  describe('readUsageFiles', () => {
    test('throws an error if it is not a valid glob', () => {
      expect(() => readFiles('')).toThrow(`usageFiles isn't a valid glob pattern.`)
    })

    test('throws an error if it does not find any file', () => {
      const filePattern = path.resolve(__dirname, '../fixtures/vue-files/**/*.txt')

      expect(() => readFiles(filePattern)).toThrow('usageFiles glob has no files.')
    })
  })
})
