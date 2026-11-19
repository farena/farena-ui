// @ts-check
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/dist/",
    "**/build/",
    "**/coverage/",
    ".playwright-cli/",
    // Local-only folders (gitignored)
    "apps/",
    "docs/",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended],
    rules: {
      // React Compiler oriented rules. The library does not use the compiler and
      // relies on deliberate "latest value" refs and prop-to-state sync effects,
      // so these stay visible as warnings instead of blocking CI.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["playground/src/**/*.tsx"],
    extends: [reactRefresh.configs.vite],
  },
  {
    files: [
      "**/*.{js,mjs,cjs}",
      "**/vite.config.ts",
      "**/vitest.config.ts",
      "scripts/**",
      "packages/*/scripts/**",
    ],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
]);
