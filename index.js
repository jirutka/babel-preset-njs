const { declare } = require('@babel/helper-plugin-utils')
const { OptionValidator } = require('@babel/helper-validator-option')

const proposalClassProperties = require('@babel/plugin-proposal-class-properties')
const proposalExportNamespaceFrom = require('@babel/plugin-proposal-export-namespace-from')
const proposalLogicalAssignmentOperators = require('@babel/plugin-proposal-logical-assignment-operators')
const proposalObjectRestSpread = require('@babel/plugin-proposal-object-rest-spread')
const proposalOptionalCatchBinding = require('@babel/plugin-proposal-optional-catch-binding')
const proposalOptionalChaining = require('@babel/plugin-proposal-optional-chaining')
const proposalPrivatePropertyInObject = require('@babel/plugin-proposal-private-property-in-object')
const proposalUnicodePropertyRegex = require('@babel/plugin-proposal-unicode-property-regex')
const transformBlockScoping = require('@babel/plugin-transform-block-scoping')
const transformClasses = require('@babel/plugin-transform-classes')
const transformDestructuring = require('@babel/plugin-transform-destructuring')
const transformDotallRegex = require('@babel/plugin-transform-dotall-regex')
const transformForOf = require('@babel/plugin-transform-for-of')
const transformNewTarget = require('@babel/plugin-transform-new-target')
const transformObjectSuper = require('@babel/plugin-transform-object-super')
const transformParameters = require('@babel/plugin-transform-parameters')
const transformSpread = require('@babel/plugin-transform-spread')
const transformUnicodeEscapes = require('@babel/plugin-transform-unicode-escapes')
const transformUnicodeRegex = require('@babel/plugin-transform-unicode-regex')


const v = new OptionValidator('babel-preset-njs')

module.exports = declare((api, opts) => {
  api.assertVersion(7)

  const assumeArrayIterables = v.validateBooleanOption(
    'assumeArrayIterables',
    opts.assumeArrayIterables,
    true,
  )

  const looseClasses = v.validateBooleanOption(
    'looseClasses',
    opts.looseClasses,
    true,
  )

  const looseObjectRestSpread = v.validateBooleanOption(
    'looseObjectRestSpread',
    opts.looseObjectRestSpread,
    true,
  )

  const looseParameters = v.validateBooleanOption(
    'looseParameters',
    opts.looseParameters,
    true,
  )

  return {
    plugins: [
      [proposalClassProperties, {
        // Define properties using an assignment expression instead of `Object.defineProperty`.
        // This is more performant, but it might produce unexpected results in some (corner) cases.
        // TypeScript transpiles class properties in the same way.
        loose: looseClasses,
      }],
      [proposalExportNamespaceFrom],
      [proposalLogicalAssignmentOperators],
      [proposalObjectRestSpread, {
        // Use `Object.assign()` instead of special helper. This is more performant, but it might
        // produce unexpected results in some (corner) cases (when overwriting read-only target
        // property). Also it matches behaviour TypeScript's transpiler.
        loose: looseObjectRestSpread,
        // njs has `Object.assign()`, so use it directly instead of the Babel's extends helper.
        useBuiltIns: true,
      }],
      [proposalOptionalCatchBinding],
      [proposalOptionalChaining, {
        // This is more performant and completely safe in non-browser environment.
        loose: true,
      }],
      [proposalPrivatePropertyInObject, {
        // This must match `loose` in proposal-class-properties.
        loose: looseClasses,
      }],
      [proposalUnicodePropertyRegex, {
        // njs doesn't support unicode flag yet (`/foo/u`).
        useUnicodeFlag: true,
      }],
      [transformBlockScoping],
      [transformClasses, {
        // This is more performant, but it might produce unexpected results in some (corner) cases.
        // Also it matches behaviour TypeScript's transpiler.
        loose: looseClasses,
      }],
      [transformDestructuring, {
        // Assume that what you want to destructure is an array. This is more performant, but
        // produces a wrong result if the value to destructure is not an array. It matches behaviour
        // of TypeScript transpiler with disabled `downlevelIteration` and TypeScript also warns you
        // when used for non-array.
        loose: assumeArrayIterables,
        // njs has `Object.assign()`, so use it directly instead of the Babel's extends helper.
        useBuiltIns: true,
      }],
      [transformDotallRegex],
      [transformForOf, {
        // Assume that what you want to loop over is always an array. This is much more performant,
        // but produces a wrong result for non-array iterables. This matches behaviour of TypeScript
        // transpiler with disabled `downlevelIteration` and TypeScript also warns you when used for
        // non-array.
        assumeArray: assumeArrayIterables,
      }],
      [transformNewTarget],
      [transformObjectSuper],
      [transformParameters, {
        // This is more performant, but default values will be counted into the arity of the function
        // which is against spec. Also it matches behaviour of TypeScript's transpiler.
        loose: looseParameters,
      }],
      [transformSpread, {
        // Assume that all iterables are arrays. This more performant, but produces a wrong result
        // for non-arrays. This matches behaviour of TypeScript transpiler with disabled
        // `downlevelIteration` and TypeScript also warns you when used for non-array.
        loose: assumeArrayIterables,
      }],
      [transformUnicodeEscapes],
      [transformUnicodeRegex],
    ],
  }
})
