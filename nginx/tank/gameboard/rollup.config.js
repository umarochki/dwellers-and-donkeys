import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const prod = process.env.NODE_ENV === 'production'
const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
const banner = [
    `/*!`,
    ` * ${pkg.name} - v${pkg.version}`,
    ` * Compiled ${compiled}`,
    ` *`,
    ` * ${pkg.name} is licensed under the MIT License.`,
    ` * http://www.opensource.org/licenses/mit-license`,
    ` */`,
].join('\n');

const name = 'gameboard';
const sourcemap = true;
const input = 'src/app.ts';

const bundleExternal = Object.keys(pkg.dependencies);
const plugins = [
    resolve(),
    commonjs(),
    typescript({ module: "ESNext" }),
    ...prod ? [terser({
        output: {
            comments: (node, comment) => comment.line === 1
        }
    })] : []
];

export default [
    {
        input,
        external: bundleExternal,
        plugins,
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap,
                banner,
                globals: {
                    'pixi.js-legacy': 'PIXI'
                }
            }
        ]
    }
];