import globals from 'globals';
const { browser: browserGlobals } = globals;

import prettierPlugin from 'eslint-plugin-prettier';
const prettierRules = prettierPlugin.configs.recommended.rules;

import tsPlugin from '@typescript-eslint/eslint-plugin';
const tsRules = tsPlugin.configs.recommended.rules;

import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierRules,
      ...tsRules,
      'prettier/prettier': 'error',
    },
    ignores: [
      '**/node_modules/**',
      '**/*.vsix',
      '**/recordings/**',
      '**/*.gif',
    ],
  },
];
