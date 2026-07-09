import { defineConfig, globalIgnores } from 'eslint/config';
import { globals } from 'eslint-config-zakodium';
import js from 'eslint-config-zakodium/js';
import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';
import unicorn from 'eslint-config-zakodium/unicorn';

export default defineConfig(
  globalIgnores([
    'coverage',
    '**/dist',
    'frontend/e2e',
    'frontend/playwright.config.ts',
    'frontend/playwright-report',
    'frontend/test-results',
  ]),
  js,
  unicorn,
  {
    files: ['src/**'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  { files: ['frontend/**'], extends: [ts, react] },
);
