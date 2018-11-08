/*! .rolluprc.js | @author brikcss <https://github.com/brikcss> | @reference https://rollupjs.org */

/** Set up environment.
 ================================================================================================ */

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

// Flags.
const env = process.env.NODE_ENV
const isProd = ['production', 'prod', 'test'].includes(env)
const lib = {
  name: 'tplit',
  namePrefix: 'brikcss'
}

/** Build config functions.
 ================================================================================================ */

/**
 * buildConfig() Build a config by passing a simple format (and optionally custom config props).
 *
 * @param  {(Array|string)}  formats  Format(s) to build config for ('cfs'|'es'|'iife'|'umd').
 * @param  {Object}          config   Custom configuration.
 */
function buildConfig (formats = 'cjs', config = {}) {
  const isCjs = Boolean(formats.includes('cjs'))

  // Merge config with default config.
  config = Object.assign({
    input: `src/${lib.name}.js`,
    output: formats,
    plugins: [
      resolve(),
      commonjs()
    ].concat(formats.includes('es') ? [] : babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '9',
              browsers: isCjs ? undefined : ['last 2 versions', '> 2%', 'not dead']
            },
            modules: isCjs ? undefined : false
          }
        ]
      ]
    }
    )).concat(isProd ? [terser()] : []),
    watch: {
      chokidar: true,
      include: 'src/**',
      exclude: 'node_modules/**',
      clearScreen: true
    }
  }, config)

  // Build outputs.
  if (config.output instanceof Array) {
    config.output = config.output.map(buildOutput)
  } else if (typeof config.output === 'string') {
    config.output = buildOutput(config.output)
  }

  return config
}

/**
 * buildOutput() Builds config.output property based on a format string.
 *
 * @param  {string}  output  Output format. Gets passed to `output.format`.
 */
function buildOutput (output = 'cjs') {
  const pkgKey = {
    cjs: 'main',
    es: 'module',
    iife: 'browser',
    umd: 'umd',
    bin: 'bin'
  }
  const libName = (lib.namePrefix ? lib.namePrefix + '.' : '') + lib.name
  if (typeof output === 'string') output = { format: output }
  output = Object.assign({
    name: ['iife', 'umd'].includes(output.format) ? libName : undefined,
    file: (pkg[pkgKey[output.format]] || `./${output.format}/${libName}.min.js`).replace(isProd ? '' : '.min', '')
  }, output)

  return output
}

/** Exports.
 ================================================================================================ */

export default isProd ? [buildConfig(['cjs', 'es']), buildConfig(['iife', 'umd'])] : buildConfig('cjs')
