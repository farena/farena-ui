import { mkdtemp, readFile, writeFile, realpath } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temp = await mkdtemp(join(tmpdir(), "farena-ui-smoke-"));
function run(command, args, cwd = temp, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")} failed\n${result.stderr ?? ""}`);
  return result.stdout;
}
const manifest = JSON.parse(await readFile(join(root, "scripts/component-manifest.json"), "utf8"));
const packed = JSON.parse(
  run(
    "npm",
    ["pack", "--workspace=@farena/farena-ui", "--pack-destination", temp, "--json"],
    root,
    true,
  ),
)[0];
for (const { path } of packed.files) {
  if (!/^(dist\/|README\.md$|CHANGELOG\.md$|package\.json$)/.test(path))
    throw new Error(`Unexpected package file: ${path}`);
  if (/\.test\.|\.env|Sidebar|Topbar/.test(path)) throw new Error(`Private file packed: ${path}`);
}
await writeFile(
  join(temp, "package.json"),
  JSON.stringify(
    {
      private: true,
      type: "module",
      dependencies: {
        "@farena/farena-ui": `file:${join(temp, packed.filename)}`,
        react: "19.3.0",
        "react-dom": "19.3.0",
        typescript: "5.9.3",
        vite: "8.3.4",
        "@types/react": "19.2.18",
        "@types/react-dom": "19.2.7",
      },
    },
    null,
    2,
  ),
);
run("npm", [
  "install",
  "--ignore-scripts",
  "--no-audit",
  "--no-fund",
  "--fetch-retries=0",
  "--fetch-timeout=30000",
]);
const installed = join(temp, "node_modules/@farena/farena-ui");
if ((await realpath(installed)).startsWith(root))
  throw new Error("External consumer resolves a workspace symlink");
const pkg = JSON.parse(await readFile(join(installed, "package.json"), "utf8"));
for (const dep of [
  "@farena/fa-modal-react",
  "@farena/fa-wysiwyg-react",
  "@monaco-editor/react",
  "monaco-editor",
  "apexcharts",
  "react-apexcharts",
]) {
  if (!pkg.dependencies[dep]) throw new Error(`Missing advanced dependency ${dep}`);
}
for (const name of Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })) {
  if (/router|redux/i.test(name)) throw new Error(`Panel dependency leaked: ${name}`);
}
const declarations = await readFile(join(installed, "dist/index.d.ts"), "utf8");
if (/~\/|apps\/admin/.test(declarations)) throw new Error("Admin alias in declarations");
await readFile(join(installed, "dist/styles.css"));
await writeFile(
  join(temp, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      noUncheckedSideEffectImports: true,
      noEmit: true,
      types: ["vite/client"],
    },
    include: ["main.tsx"],
  }),
);
await writeFile(
  join(temp, "index.html"),
  '<html><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
);
const names = manifest.map((item) => item.name);
await writeFile(
  join(temp, "main.tsx"),
  `import * as UI from '@farena/farena-ui';\nimport type { Tab, SelectOption, UploadedFile, CommentAttachment, CommentForm, DateRangeValue, CustomDateRange, CalendarLang, CalendarDate, CalendarRange, CalendarRestrictions, DateRange, ChartBaseProps, HeatmapRange, CropRect, ImageCropperHandle, PaginatedData, InfiniteScrollChange, InfiniteScrollHandle, FormCodeHandle, FormHtmlHandle, LinkTarget, LinkRenderer } from '@farena/farena-ui';\nimport '@farena/farena-ui/styles.css';\nimport {createRoot} from 'react-dom/client';\nconst all = [${names.map((name) => `UI.${name}`).join(", ")}];\nconsole.log(all);\ncreateRoot(document.getElementById('root')!).render(<UI.ToastProvider><UI.FormButton>External consumer</UI.FormButton><UI.FormCode value="hello" onChange={()=>{}}/><UI.FormHtml value="<p>hello</p>" onChange={()=>{}}/><UI.LineChart series={[{name:'Values',data:[1,2]}]}/></UI.ToastProvider>);`,
);
run("npx", ["--no-install", "tsc"]);
run("npx", ["--no-install", "vite", "build"]);
await writeFile(
  join(temp, "node-smoke.mjs"),
  `import assert from 'node:assert/strict';\nimport * as UI from '@farena/farena-ui';\nimport React from 'react';\nimport {renderToString} from 'react-dom/server';\nfor (const name of ${JSON.stringify(names)}) assert.equal(typeof UI[name], 'function', name);\nassert.equal('Sidebar' in UI, false); assert.equal('Topbar' in UI, false);\nfor (const name of ['Chart','FormCode','FormHtml']) { const props = name === 'Chart' ? {type:'line',series:[]} : {value:'',onChange(){}}; renderToString(React.createElement(UI[name],props)); }\nassert.match(renderToString(React.createElement(UI.FormButton,null,'Ready')), /Ready/);\nconsole.log('Node imports, public inventory and render: OK');`,
);
run("node", ["node-smoke.mjs"]);
run("npm", ["ls", "react", "--all"]);
console.log(`External package smoke passed: ${names.length} components. Artifacts: ${temp}`);
