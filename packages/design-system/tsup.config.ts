import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    dynamic: "src/dynamic.tsx",
  },
  format: ["cjs", "esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
});
