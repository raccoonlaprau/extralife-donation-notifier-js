import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [typescript({ module: 'esnext' })],
  },
  {
    input: 'dist/index.js',
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        name: 'ExtraLifeDonationWatcher',
        file: pkg.browser[`./${pkg.main}`],
        format: 'iife',
        sourcemap: true,
      },
    ],
    plugins: [resolve(), commonjs()],
  },
];
