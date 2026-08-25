/**
 * Compiles the test graph to CommonJS, then runs it with node:test.
 *
 * Node can execute TypeScript directly, but only with explicit file extensions
 * on every import. Compiling first keeps the source idiomatic and means the
 * tests run against the real modules rather than copies.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const OUT_DIR = ".test-build";

function collectTests(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return collectTests(path);
    return entry.name.endsWith(".test.js") ? [path] : [];
  });
}

rmSync(OUT_DIR, { recursive: true, force: true });

// Resolve the local compiler directly: no shell, so this behaves the same on
// Windows and CI.
const tsc = require.resolve("typescript/bin/tsc");
execFileSync(process.execPath, [tsc, "--project", "tsconfig.test.json"], {
  stdio: "inherit",
});

const testFiles = collectTests(join(OUT_DIR, "__tests__"));

if (testFiles.length === 0) {
  console.error("No compiled test files found.");
  process.exit(1);
}

execFileSync(process.execPath, ["--test", ...testFiles], { stdio: "inherit" });
