import * as sass from 'sass'
import assert from 'node:assert'

const EXIT_SUCCESS = 0
const EXIT_FAILURE = 1
const CAPTURE_INDEX = 1

const { css } = sass.compile('src/styles/main.scss')

console.log('--- Checking CSS for Mobile Hover Bug ---')

// 1. Check if board tile hover is scoped under @media (hover: hover)
const hasHoverMediaQuery = css.includes('@media (hover: hover)') || css.includes('@media (hover:hover)')

// 2. Check if .board__tile:hover contains shorthand `background:` without background-color
const tileHoverMatch = css.match(/\.board__tile:hover\s*\{(?<content>[^}]+)\}/)
let hasShorthandBackgroundInHover = false
if (tileHoverMatch) {
  const content = tileHoverMatch[CAPTURE_INDEX]
  hasShorthandBackgroundInHover = /\bbackground\s*:/i.test(content) && !/\bbackground-color\s*:/i.test(content)
}

console.log('1. Has @media (hover: hover) query for hover states:', hasHoverMediaQuery)
console.log('2. Has destructive background shorthand in .board__tile:hover:', hasShorthandBackgroundInHover)

try {
  assert.strictEqual(hasHoverMediaQuery, true, 'Hover styles must be wrapped in @media (hover: hover) to prevent mobile sticky tap hover')
  assert.strictEqual(hasShorthandBackgroundInHover, false, 'board__tile:hover must not use background shorthand property which breaks background-size/position')
  console.log('\n✅ PASS: Hover behavior is correctly configured for mobile and desktop.')
  process.exit(EXIT_SUCCESS)
} catch (err) {
  let errorMsg = String(err)
  if (err instanceof Error) {
    errorMsg = err.message
  }
  console.error('\n❌ FAIL:', errorMsg)
  process.exit(EXIT_FAILURE)
}
