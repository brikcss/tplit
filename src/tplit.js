import fs from 'fs'

/**
 * include() Helper function to include a file.
 *
 * @param   {String}  filepath  File path.
 * @param   {Object}  options   Options passed to fs.
 * @return  {Function}  Tplit's compile function.
 */
function include (filepath, options = {}) {
  return tplit(fs.readFileSync(filepath, 'utf8'), options)
}

/**
 * tplit() Main tplit function which gives the most flexibility in compiling templates.
 *
 * @param   {string}    template          Template to compile.
 * @param   {Object}    options           Options.
 * @param   {string}    options.prop      Property name to use as context data object.
 * @param   {Function}  options.map       Map function to call on all data values.
 * @param   {boolean}   options.split     Whether to return the split template (chunks and values).
 * @return  {Function}  Compile function.
 */
function tplit (template, { prop = 'this', map = undefined, split = false } = {}) {
  return (context = this || {}) => {
    const cache = {}

    // Attach include function to context.
    if (prop) {
      context.include = (filepath) => include(filepath, { prop, map, split })(context)
    }

    // Parses tplit values. This needs to be done if prop doesn't exist (which means we flatten
    // values) or if the map function exists.
    if (!prop || map) {
      if (!prop) {
        cache.keys = ['include']
        cache.values = [(filepath) => include(filepath, { prop, map, split })(context)]
      }
      for (var key in context) {
        if (cache.keys) cache.keys.push(key)
        const value = typeof map === 'function' ? map(context[key], key, context) || context[key] : context[key]
        if (cache.values) {
          cache.values.push(value)
        } else {
          context[key] = value
        }
      }
    }

    // Build new function.
    cache.fn = {}
    if (!prop) {
      cache.fn.args = cache.keys
      cache.fn.call = 'apply'
      cache.fn.context = context
      cache.fn.values = cache.values
    } else {
      if (prop === 'this') {
        cache.fn.args = 'props'
        cache.fn.context = context
      } else {
        cache.fn.args = prop
        cache.fn.context = null
      }
      cache.fn.call = 'call'
      cache.fn.values = context
    }
    cache.fn.body = 'return ' + (split ? '((chunks, ...values) => [chunks, values])' : '') + '`' + template + '`'

    // Return the new function and call it.
    // eslint-disable-next-line no-new-func
    return new Function(cache.fn.args, cache.fn.body)[cache.fn.call](cache.fn.context, cache.fn.values)
  }
}

/**
 * tplitReduce() Utilizes `reduce` to reduce template literal to a string, which allows the usage of
 * outside scope on template literals.
 *
 * @param  {Function} map Map function to call on each value.
 * @return {Function}     Compile function.
 */
function tplitReduce (map = arg => arg) {
  return (literals, ...values) => {
    return literals.reduce((accumulator, value, index) => {
      return accumulator + map(values[index - 1]) + value
    })
  }
}

export default tplit
export { tplit, tplitReduce }
