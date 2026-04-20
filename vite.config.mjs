import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import dns from "node:dns";
import eslintPlugin from "vite-plugin-eslint";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import autoprefixer from "autoprefixer";
import viteCompression from "vite-plugin-compression";
import legacy from "@vitejs/plugin-legacy";

dns.setDefaultResultOrder("verbatim");

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  server: {
    host: true,
    open: true,
    port: 8080
  },
  preview: {
    host: true,
    open: true,
    port: 8081,
  },
  plugins: [
    vue({template: {transformAssetUrls}}),
    vuetify({
      autoImport: true,
    }),
    legacy({
      targets: ['defaults', 'not IE 11'], // Or your specific requirements
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // Replaces your manual import
      renderLegacyChunks: true,
      polyfills: true
    }),
    eslintPlugin(),
    nodePolyfills(),
    viteCompression()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "source-map-js": "source-map",
      'query-builder-vue-3': path.resolve(__dirname, 'node_modules/query-builder-vue-3/dist/query-builder-vue-3.js'),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".svg"],
  },
  optimizeDeps: {
    include: ["vuetify"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/index.scss";`,
        api: "modern-compiler", // or "modern"
      },
    },
    postcss: {
      plugins: [autoprefixer]
    },
  },
  build: {
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'oxc',
    target: 'baseline-widely-available',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1250,
    commonjsOptions: {transformMixedEsModules: true},
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        dir: "dist",
        manualChunks: {
          'vendor-vuetify': ['vuetify'],
        },
        format: "es"
      },
    }
  }
});
