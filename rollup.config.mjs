import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

/** @type {import('rollup').RollupOptions} */
export default {
    input: './src/examples/lambda.ts',
    external: ['reflect-metadata', 'tslib'],
    output: [
        {
            dir: 'dist',
            format: 'esm',
            sourcemap: true,
            preserveModules: true,
            entryFileNames: '[name].mjs',
        },
        {
            dir: 'dist',
            format: 'cjs',
            sourcemap: true,
            preserveModules: true,
            entryFileNames: '[name].cjs',
        },
    ],
    plugins: [
        json(),
        nodeResolve({
            extensions: ['.js', '.ts', '.json'],
            preferBuiltins: false,
        }),
        commonjs({
            transformMixedEsModules: true,
        }),
        typescript(),
    ],
    treeshake: false,
}
