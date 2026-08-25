import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Compiled test output.
    ".test-build/**",
    // Backend CommonJS Express service (linted via backend's own linter)
    "backend/**",
    // Plain CommonJS Node services, linted by their own runtime rules.
    "mock-backend/**",
    // Scratch area for specs and source material, not part of the build.
    "EXTRA/**",
  ]),
]);

export default eslintConfig;
