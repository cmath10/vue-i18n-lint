import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default async function (srcPath: string): Promise<string> {
  const bundle = await rollup({
    input: srcPath,
    plugins: [
      nodeResolve(),
      babel({
        presets: [['@babel/env', { modules: false }]],
        extensions: ['js'],
        babelHelpers: 'bundled',
      }),
    ],
  })

  const { output } = await bundle.generate({
    format: 'cjs',
    exports: 'auto',
  })

  return output[0].code
}
