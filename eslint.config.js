import { defineConfig } from 'eslint/config';
import js from 'eslint-config-cheminfo/base';
import globals from 'globals';

export default defineConfig(js, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
});
