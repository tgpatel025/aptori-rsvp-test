import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    'src/prisma/migrations',
  ]),
  {
    files: ['**/*.ts', '**/*.yaml'],
    extends: compat.extends(
      'google',
      'plugin:prettier/recommended',
      'plugin:jsonc/recommended-with-jsonc',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        fetch: 'readonly',
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'valid-jsdoc': 'off',
      'require-jsdoc': 'off',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 0,
        },
      ],

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          semi: true,
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'eol-last': 'error',
      'no-undef': 'error',
      'no-invalid-this': 'off',
      'new-cap': 'off',
    },
  },
  {
    files: ['**/*.service.ts'],

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
]);