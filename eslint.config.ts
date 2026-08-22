// @ts-ignore
import vuetify from 'eslint-config-vuetify'

export default vuetify({
  pnpm: {
    enforceCatalog: true,
  },
}, {
  files: [
    '**/*.md/*.*',
  ],
  rules: {
    '@typescript-eslint/no-this-alias': 'off',
    'array-bracket-spacing': 'off',
    'n/handle-callback-err': 'off',
    'no-restricted-syntax': 'off',
    'no-labels': 'off',
    'vue/block-tag-newline': 'off',
  },
},
{
  files: [
    '**/*.ts',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
  },
},
{
  // rollup/vite plugin hooks are called with the plugin context as `this`
  files: [
    '**/src/vite/**/*.ts',
    '**/custom-configuration.cjs',
  ],
  rules: {
    'unicorn/no-this-outside-of-class': 'off',
  },
},
)
