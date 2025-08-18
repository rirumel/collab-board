// eslint.config.mjs
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import ts from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";

export default ts.config(
  // 1) global ignores for monorepo
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.output/**",
      "**/.vite/**",
      "packages/*/dist/**",
    ],
  },

  // 2) base JS rules
  js.configs.recommended,

  // 3) TypeScript rules (no type-checking needed to start)
  ...ts.configs.recommended,

  // 4) Vue flat preset (this is the key change: use flat config + spread)
  ...vue.configs["flat/recommended"],

  // 5) Per-file environment adjustments
  // Frontend Vue files (browser globals + TS inside <script lang="ts">)
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // IMPORTANT: never set `parser` to @typescript-eslint/parser directly for Vue
        // Vue requires vue-eslint-parser and we pass TS parser via parserOptions.parser
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    // place any Vue-specific rule tweaks here
    rules: {
      // example (optional): allow single-word component names
      // 'vue/multi-word-component-names': 'off',
    },
  },

  // Backend (Node) files
  {
    files: ["packages/backend/**/*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Plain TS files (in both packages)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // 6) Turn off rules that conflict with Prettier
  prettier
);
