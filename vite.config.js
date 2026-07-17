import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "src/index.html"),
        info: resolve(import.meta.dirname, "src/info.html"),
        instruction: resolve(import.meta.dirname, "src/instruction.html"),
      },
    },
  },
  server: {
    port: 4200,
  },
});
