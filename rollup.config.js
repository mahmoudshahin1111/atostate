const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');
const resolve = require('@rollup/plugin-node-resolve');

const plugins = [resolve(), typescript({ tsconfig: './tsconfig.json' })];

module.exports = [
  // =========================
  // Browser builds
  // =========================
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.browser.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/index.browser.iife.js',
        format: 'iife',
        name: 'atostate',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins,
  },

  // =========================
  // Node.js builds
  // =========================
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.node.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/index.node.cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins,
  },
];
