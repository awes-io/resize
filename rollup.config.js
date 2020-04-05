import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const baseConfig = {
    input: 'src/index.js',
    plugins: [babel()]
}

export default [
    {
        ...baseConfig,
        output: {
            file: 'dist/index.js',
            format: 'cjs'
        },
        plugins: [
            resolve(),
            commonjs({
                namedExports: {
                    'node_modules/lodash/lodash.js': ['merge']
                }
            })
        ]
    },
    {
        ...baseConfig,
        output: {
            file: 'dist/index.esm.js',
            format: 'esm'
        },
        plugins: [
            resolve(),
            commonjs({
                namedExports: {
                    'node_modules/lodash/lodash.js': ['merge']
                }
            })
        ]
    }
]
