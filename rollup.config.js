import { readFileSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { visualizer } from 'rollup-plugin-visualizer'

const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
)

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
            // 为什么设置之后就报错？
            // [!] (plugin commonjs--resolver)
            // TypeError: The "path" argument must be of type string or an instance of URL. Received null
            // exportConditions: ['node']
        }),
        commonjs(),
        visualizer()
    ]
})
