import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages serves the playground from /<repo>/; the deploy workflow sets it
  base: process.env.PLAYGROUND_BASE ?? "/",
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
