import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      crypto: true,
      buffer: true,
      process: true,
    }),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.js",
  },
  build: {
    outDir: path.join(__dirname, "..", "server", "build"),
    emptyOutDir: true,
  },
});
