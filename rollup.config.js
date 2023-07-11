import typescript from "@rollup/plugin-typescript";
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import svg from "rollup-plugin-svg"
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import sass from 'rollup-plugin-sass'
import pkg from "./package.json";


const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.exports.require,
        format: "commonjs",
        exports: 'named',
        sourcemap: true,interop: "compat"
      },
      {
        file: pkg.exports.import,
        format: "esm",
        exports: 'named',
        sourcemap: true, interop: "compat"
      },
    ],
    plugins: [
      sass({ insert: true }), 
      typescript({ 
        tsconfig: "./tsconfig.json",
      }),
      json(),
      svg(),
      commonjs({
        namedExports: {
          'react-table': [
            'useTable',
            'useSortBy',
            'useExpanded',
            'useRowSelect',
          ],
          'react-select': [
            'components',
          ],
          'node_modules/react-is/index.js': [
            'isElement',
            'isValidElementType',
            'ForwardRef'
          ],
          'react-csv': [
            'CSVLink'
          ]
        }
      })
    ],
    external: ['react', 'react-dom', '@optalp/react-server-side-table', 'react-select']
  },
  {
    input: "src/index.ts",
    output: [{ file: pkg.types, format: "es", interop: "compat"}],
    external: [/\.scss$/, './src/components'],
    plugins: [dts.default()],
  },
]

export default config;