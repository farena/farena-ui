import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

const runtimeDependencies = Object.keys(pkg.dependencies);

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/entry.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.js",
      cssFileName: "styles",
    },
    rolldownOptions: {
      external: (id) =>
        /^(react|react-dom)(\/|$)/.test(id) ||
        (!id.includes("?worker") &&
          runtimeDependencies.some(
            (dependency) => id === dependency || id.startsWith(`${dependency}/`),
          )),
    },
  },
});
