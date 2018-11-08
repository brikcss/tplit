/* eslint-env jest */
import { tplit, tplitReduce } from './tplit'

test('Call tplit as a function with a string', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${this.name ? this.name : 'there'}. You like ${this.likes.join(', ')}."
  const compile = tplit(template)
  const compiled = compile({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes']
  })
  expect(typeof compile).toBe('function')
  expect(compiled).toBe('Hello, Jonny. You like ice cream, candy, mashed potatoes.')
})

test('Customize the `props` object name', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${props.name ? props.name : 'there'}. You like ${props.likes.join(', ')}."
  const compiled = tplit(template, { prop: 'props' })({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes']
  })
  expect(compiled).toBe('Hello, Jonny. You like ice cream, candy, mashed potatoes.')
})

test('Flatten `props` (no object name)', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${name ? name : 'there'}. You like ${likes.join(', ')}."
  const compiled = tplit(template, { prop: false })({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes']
  })
  expect(compiled).toBe('Hello, Jonny. You like ice cream, candy, mashed potatoes.')
})

test('Pass map/filter function to modify data values', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${this.name ? this.name : 'there'}. You like ${this.likes.join(', ')}."
  const compiled = tplit(template, { map: (value, key) => {
    if (key !== 'name') return
    return value.toUpperCase()
  } })({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes']
  })
  expect(compiled).toBe('Hello, JONNY. You like ice cream, candy, mashed potatoes.')
})

test('Return the template compile function to render with data later', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${this.name ? this.name : 'there'}. You like ${this.likes.join(', ')}."
  const compile = tplit(template)
  expect(typeof compile).toBe('function')
})

test('Return the split template\'s chunks and values', () => {
  // eslint-disable-next-line no-template-curly-in-string
  let template = "Hello, ${this.name ? this.name : 'there'}. You like ${this.likes.join(', ')}."
  template = tplit(template, { split: true })({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes']
  })
  const compiled = tplitReduce(value => value.toUpperCase())(template[0], ...template[1])
  expect(template).toEqual([['Hello, ', '. You like ', '.'], ['Jonny', 'ice cream, candy, mashed potatoes']])
  expect(compiled).toBe('Hello, JONNY. You like ICE CREAM, CANDY, MASHED POTATOES.')
})

test('Call as a tagged literal (allows use of outside scope)', () => {
  // eslint-disable-next-line no-template-curly-in-string
  let name = 'Jonny'; let likes = ['ice cream', 'candy', 'mashed potatoes']
  const compiled = tplitReduce()`Hello, ${name || 'there'}. You like ${likes.join(', ')}.`
  expect(compiled).toBe('Hello, Jonny. You like ice cream, candy, mashed potatoes.')
})

test('Compile with partial file includes', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${this.name ? this.name : 'there'}. You like ${this.likes.join(', ')}.\n\n${this.include('./fixtures/_include.md')}"
  const compiled = tplit(template)({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes'],
    parent: 'stdin'
  })
  expect(compiled).toBe('Hello, Jonny. You like ice cream, candy, mashed potatoes.\n\nI am a file include from stdin.\n')
})

test('Compile with partial and flat data', () => {
  // eslint-disable-next-line no-template-curly-in-string
  const template = "Hello, ${name ? name : 'there'}. You like ${likes.join(', ')}.\n\n${include('./fixtures/_include--flat.md')}"
  const compiled = tplit(template, { prop: false })({
    name: 'Jonny',
    likes: ['ice cream', 'candy', 'mashed potatoes'],
    parent: 'stdin'
  })
  expect(compiled).toBe('Hello, Jonny. You like ice cream, candy, mashed potatoes.\n\nI am a file include from stdin.\n')
})

test.skip('???Compile with YAML???', () => {})

test.skip('???Compile with reusable helper functions???', () => {})
