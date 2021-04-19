import sass from 'rollup-plugin-sass'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json'

export default {
  input: 'src/ServerSideTable.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    sass({ insert: true }), 
    typescript(),
    commonjs({
      namedExports: {
        'react-table': [
          'useTable',
          'useSortBy',
          'useExpanded'
        ],
        'react-select': [
          'components'
        ],
        'node_modules/react-is/index.js': [
          'isElement',
          'isValidElementType',
          'ForwardRef'
        ]
      }
    })
  ],
  external: ['react', 'react-dom']
}