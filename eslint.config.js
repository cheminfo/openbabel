import { defineConfig, globalIgnores } from 'eslint/config';
import { globals } from 'eslint-config-zakodium';
import js from 'eslint-config-zakodium/js';
import unicorn from 'eslint-config-zakodium/unicorn';

export default defineConfig(globalIgnores(['coverage']), js, unicorn, {
  languageOptions: {
    globals: {
      ...globals.nodeBuiltin,
    },
  },
});
