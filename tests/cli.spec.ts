import path from 'path'
import { exec, ExecException } from 'child_process'
import rimraf from 'rimraf'

function runCLI (args: string[] = []): Promise<{
    code: number
    error: ExecException | null
    stdout: string
    stderr: string
}> {
    return new Promise(resolve => {
        exec(
            `node ${path.resolve(__dirname + '../../../bin/vue-i18n-lint.js')} ${args.join(' ')}`,
            { cwd: '.' },
            (error, stdout, stderr) => {
                resolve({
                    code: error && error.code ? error.code : 0,
                    error,
                    stdout,
                    stderr,
                })
            },
        )
    })}

describe('vue-i18n-lint CLI', () => {
    describe('Report Command', () => {
        it('Run use-config without config file', async () => {
            const result = await runCLI(['use-some'])
            // rimraf.sync('./vue-i18n-lint.config.js');

            expect(result.code).not.toBe(0);
            expect(result.stderr).toContain(`Cannot find module '/var/www/vue-i18n-lint/vue-i18n-lint.config.js`);
        });

        it('Run use-config with config file', async () => {
            rimraf.sync('./vue-i18n-lint.config.js');

            expect((await runCLI([
                `use-config './vue-i18n-lint.config.js'`,
            ])).code).not.toBe(0);
        });
    });

    describe('Init Command', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.resetAllMocks();
        });

        it('creates a config file', async () => {
            expect((await runCLI([
                'init',
            ])).code).toBe(0);

            rimraf.sync('./vue-i18n-lint.config.js');
        });
    });
});