import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'eslint.config.mjs'],
  },

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.strictTypeChecked[0].rules,
      'prefer-const': 'warn',
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  eslintConfigPrettier,
]);
