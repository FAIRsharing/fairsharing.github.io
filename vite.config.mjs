import {defineConfig} from "vite";
import {fileURLToPath, URL} from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";
import dns from "node:dns";
import path from "path";
import {nodePolyfills} from "@blocksquaredev/vite-plugin-node-polyfills";
import autoprefixer from "autoprefixer";
import vike from "vike/plugin";

dns.setDefaultResultOrder("verbatim");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_OUTPUT_DIR = process.env.BUILD_OUTPUT_DIR ?? "dist";

export default defineConfig(({  isSsrBuild }) => {

  // Initialize the polyfill plugin safely
  const polyfills = nodePolyfills({
    exclude: ['module', 'http', 'https'],
    globals: { Buffer: true, process: true },
    protocolImports: true,
  });

  // Force it to ONLY run on the client build (The Vike-native way)
  polyfills.apply = (config, env) => !env.isSsrBuild;

  return {
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
      vue({ template: { transformAssetUrls } }),
      vike(),
      vuetify({ autoImport: true }),
      polyfills
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "source-map-js": "source-map",
        'query-builder-vue-3': path.resolve(__dirname, 'src/utils/query-builder-vue-3/dist/query-builder-vue-3.js'),
        vue: path.resolve("./node_modules/vue")
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".svg"],
    },
    optimizeDeps: {
      include: ['highcharts', 'highcharts-vue', 'vuetify'],
    },
    ssr: {
      noExternal: ['highcharts', 'highcharts-vue', 'vuetify'],
      external: ['axios', 'form-data']
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
      outDir: BUILD_OUTPUT_DIR,
      assetsDir: 'assets',
      sourcemap: true,
      minify: !isSsrBuild ? 'oxc' : false,
      reportCompressedSize: false, // Prevents phantom chunk terminal crash
      cssCodeSplit: true,
      chunkSizeWarningLimit: 4000,
      emptyOutDir: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/vue-code-highlight/, /node_modules/]
      },
      rollupOptions: {
        output: {
          format: "es",
        },
      },
      modulePreload: false,
    }
  };
});