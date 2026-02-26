import {FlatCompat} from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const compat = new FlatCompat();

export default [
  ...compat.extends('google'),
  {
    files: ['src/**/*.ts', 'script/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Use TypeScript-specific versions of rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',

      // Google style uses 2-space indentation
      'indent': ['error', 2],

      // Enforce single quotes and semicolons
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],

      // Max line length
      'max-len': ['error', { code: 120 }],

      // Enforce spaces inside curly braces for imports
      'object-curly-spacing': ['error', 'always'],

      // Allow TypeScript features that conflict with base Google config
      'no-invalid-this': 'off',
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
