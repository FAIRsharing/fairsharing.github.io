import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import dns from "node:dns";
import eslintPlugin from "vite-plugin-eslint";
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import compress from 'vite-plugin-compress'
dns.setDefaultResultOrder("verbatim");
import autoprefixer from 'autoprefixer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "./",
  server:{
    host: true,
    open: true,
    port: 8080
  },
  preview: {
    host: true,
    open: true,
    port: 8081,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify({
      autoImport: true,
    }),
    eslintPlugin,
    nodePolyfills(),
    compress,
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "source-map-js": "source-map"
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".svg"],
  },
  optimizeDeps: {
    include: ["vuetify"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/index.scss";',
        api: "modern-compiler", // or "modern"
      },
    },
    postcss: {
      plugins: [autoprefixer]
    },
  },
  build: {
    assetsDir: 'assets',
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1250,
    rollupOptions: {
      input:path.resolve(__dirname, "index.html"),
      output: {
        dir: "dist",
        format: "es"
      },
    }
  }
});
