import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Sass is distributed as one compiled stylesheet, never as a type dependency.
async function clean(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await clean(path);
    else if (entry.name.endsWith(".d.ts")) {
      const source = await readFile(path, "utf8");
      await writeFile(path, source.replace(/^import\s+["'][^"']+\.s?css["'];?\s*$/gm, ""));
    }
  }
}
await clean(new URL("../dist", import.meta.url).pathname);
