import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 5173 },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 4.6 uses legacy Sass syntax; silence its deprecations
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "if-function",
          "abs-percent",
          "slash-div",
        ],
      },
    },
  },
});
