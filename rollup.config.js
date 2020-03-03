import babel from 'rollup-plugin-babel'

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
        }
    },
    {
        ...baseConfig,
        output: {
            file: 'dist/index.esm.js',
            format: 'esm'
        }
    }
]
