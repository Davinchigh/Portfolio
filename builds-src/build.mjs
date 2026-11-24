// Compiles builds-src/masterclass.jsx into public/builds/masterclass.app.js.
// Run with `pnpm build:demos` after editing the source.
import { readFileSync, writeFileSync } from "node:fs"
import { transformSync } from "esbuild"

// extras.jsx (illustrations, activities, quick checks) goes in just before the app is mounted.
const main = readFileSync(new URL("./masterclass.jsx", import.meta.url), "utf8")
const extras = readFileSync(new URL("./extras.jsx", import.meta.url), "utf8")
const mount = main.lastIndexOf("ReactDOM.createRoot")
const source = main.slice(0, mount) + extras + "\n" + main.slice(mount)
const { code } = transformSync(source, { loader: "jsx", jsx: "transform", target: "es2019", charset: "utf8" })
writeFileSync(
  new URL("../public/builds/masterclass.app.js", import.meta.url),
  `// Compiled from builds-src/masterclass.jsx. Edit the source, then run pnpm build:demos.\n${code}`,
)
console.log(`masterclass.app.js: ${code.length} bytes`)
