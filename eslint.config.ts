import vuetify from 'eslint-config-vuetify'

export default vuetify({
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
})
