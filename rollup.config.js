import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import postcss from 'rollup-plugin-postcss';

// The main JavaScript bundle for modern browsers that support
// JavaScript modules and other ES2015+ features.
const config = {
  input: './build/component.js',
  output: {
    dir: './dist/',
    format: 'esm',
  },
  plugins: [
    postcss({
      // Write all styles to the bundle destination where .js is replaced by .css
      inject: false
    }),
    minifyHTML(),
    resolve(),
    commonjs(),
    injectProcessEnv({
      NODE_ENV: 'production',
    })
  ],
  preserveEntrySignatures: false,
};

if (process.env.NODE_ENV !== 'development') {
  config.plugins.push(terser());
}

export default config;
