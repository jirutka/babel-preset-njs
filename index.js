const { declarePreset } = require('@babel/helper-plugin-utils')

const proposalExportNamespaceFrom = require('@babel/plugin-proposal-export-namespace-from')
const proposalLogicalAssignmentOperators = require('@babel/plugin-proposal-logical-assignment-operators')
const proposalObjectRestSpread = require('@babel/plugin-proposal-object-rest-spread')
const proposalOptionalCatchBinding = require('@babel/plugin-proposal-optional-catch-binding')
const proposalOptionalChaining = require('@babel/plugin-proposal-optional-chaining')
const proposalUnicodePropertyRegex = require('@babel/plugin-proposal-unicode-property-regex')
const transformClasses = require('@babel/plugin-transform-classes')
const transformDestructuring = require('@babel/plugin-transform-destructuring')
const transformDotallRegex = require('@babel/plugin-transform-dotall-regex')
const transformForOf = require('@babel/plugin-transform-for-of')
const transformNewTarget = require('@babel/plugin-transform-new-target')
const transformObjectSuper = require('@babel/plugin-transform-object-super')
const transformParameters = require('@babel/plugin-transform-parameters')
const transformSpread = require('@babel/plugin-transform-spread')
const transformUnicodeRegex = require('@babel/plugin-transform-unicode-regex')


module.exports = declarePreset((api, _opts) => {
  api.assertVersion(7)

  return {
    assumptions: {
      // This is more performant, but it might produce unexpected results in some (corner) cases.
      // Also it matches behaviour TypeScript's transpiler.
      //
      // https://babeljs.io/docs/babel-plugin-transform-classes#loose
      // https://babeljs.io/docs/assumptions#constantsuper
      // https://babeljs.io/docs/assumptions#noclasscalls
      // https://babeljs.io/docs/assumptions#setclassmethods
      // https://babeljs.io/docs/assumptions#superiscallableconstructor
      constantSuper: true,
      noClassCalls: true,
      setClassMethods: true,
      superIsCallableConstructor: true,

      // This is more performant, but default values will be counted into the arity of the function
      // which is against spec. Also it matches behaviour of TypeScript's transpiler.
      //
      // https://babeljs.io/docs/assumptions#ignorefunctionlength
      // https://babeljs.io/docs/babel-plugin-transform-parameters#loose
      ignoreFunctionLength: true,

      // Assume that all iterables are arrays. This much more performant, but produces a wrong result
      // for non-arrays. This matches behaviour of TypeScript transpiler with disabled
      // `downlevelIteration` and TypeScript also warns you when used for non-array.
      //
      // https://babeljs.io/docs/babel-plugin-transform-for-of#assumearray
      // https://babeljs.io/docs/babel-plugin-transform-spread#loose
      // https://babeljs.io/docs/babel-plugin-transform-destructuring#loose
      iterableIsArray: true,

      // njs is not a browser.
      noDocumentAll: true,

      // This is enabled by default on Babel 7.
      noNewArrows: true,

      // Use `Object.assign()` instead of special helper. This is more performant, but it might
      // produce unexpected results in some (corner) cases (when overwriting read-only target
      // property). Also it matches behaviour TypeScript's transpiler.
      //
      // https://babeljs.io/docs/assumptions#setspreadproperties
      // https://babeljs.io/docs/babel-plugin-proposal-object-rest-spread#loose
      setSpreadProperties: true,
    },
    plugins: [
      [proposalExportNamespaceFrom],
      [proposalLogicalAssignmentOperators],
      [proposalObjectRestSpread, {
        // njs has `Object.assign()`, so use it directly instead of the Babel's extends helper.
        useBuiltIns: true,
      }],
      [proposalOptionalCatchBinding],
      [proposalOptionalChaining],
      [proposalUnicodePropertyRegex, {
        // njs doesn't support unicode flag yet (`/foo/u`).
        useUnicodeFlag: false,
      }],
      [transformClasses],
      [transformDestructuring, {
        // njs has `Object.assign()`, so use it directly instead of the Babel's extends helper.
        useBuiltIns: true,
      }],
      [transformDotallRegex],
      [transformForOf],
      [transformNewTarget],
      [transformObjectSuper],
      [transformParameters],
      [transformSpread],
      [transformUnicodeRegex],
    ],
  }
})
