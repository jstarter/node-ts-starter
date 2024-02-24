import { readJsonSync } from 'fs-extra/esm'
import { builtinModules } from 'node:module'
import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { visualizer } from 'rollup-plugin-visualizer'

const pkg = readJsonSync('./package.json')

// rimraf dist && rollup -c rollup.config.js
// more faster than microbundle
export default defineConfig({
    input: {
        index: 'src/index.ts'
    },
    output: [
        {
            dir: 'dist',
            entryFileNames: '[name].mjs',
            format: 'es',
            sourcemap: true
        },
        {
            dir: 'dist',
            entryFileNames: '[name].cjs',
            format: 'cjs',
            sourcemap: true
        }
    ],
    external: [...Object.keys(pkg.dependencies), ...builtinModules, /node:/],
    plugins: [
        json(),
        // https://npmmirror.com/package/rollup-plugin-esbuild
        esbuild({
            platform: 'node',
            minify: true
        }),
        // https://npmmirror.com/package/@rollup/plugin-node-resolve
        nodeResolve({
            preferBuiltins: false
            // [!] (plugin commonjs--resolver)
            // TypeError: The "path" argument must be of type string or an instance of URL. Received null
            // exportConditions: ['node'] // Why does this config cause error?
        }),
        commonjs(),
        visualizer()
    ]
})
