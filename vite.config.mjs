import {defineConfig} from "vite";
import {fileURLToPath, URL} from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";
import dns from "node:dns";
// import eslintPlugin from "vite-plugin-eslint";
import path from "path";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import autoprefixer from "autoprefixer";
import viteCompression from "vite-plugin-compression";
import legacy from "@vitejs/plugin-legacy";
import vike from "vike/plugin";

dns.setDefaultResultOrder("verbatim");

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  server: {
    host: true,
    open: true,
    port: 8080,
    sourcemap: true,
  },
  preview: {
    host: true,
    open: true,
    port: 8081,
  },
  plugins: [
    vue({template: {transformAssetUrls}}),
    vike({
      prerender: true
    }),
    vuetify({
      autoImport: true,
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: true
    }),
    // eslintPlugin(),
    nodePolyfills(),
    viteCompression({
      dir: 'dist',
    })
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
  ssr: {
    // FIX: Crucial for Vike + Vuetify to prevent SSR module resolution errors
    noExternal: ['vuetify']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/index.scss";`,
        api: "modern-compiler",
      },
    },
    postcss: {
      plugins: [autoprefixer]
    },
    devSourcemap: true
  },
  build: {
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'oxc',
    //target: 'baseline-widely-available',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1250,
    commonjsOptions: {transformMixedEsModules: true},
    rollupOptions: {
      // FIX: Removed `input: index.backup.html` and `dir: "dist"` so Vike can map your routes.
      output: {
        manualChunks: {
          'vendor-vuetify': ['vuetify'],
        },
        format: "es"
      },
    }
  }
});