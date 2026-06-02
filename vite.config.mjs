import {defineConfig} from "vite";
import {fileURLToPath, URL} from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";
import dns from "node:dns";
import path from "path";
import {nodePolyfills} from "@blocksquaredev/vite-plugin-node-polyfills";
import autoprefixer from "autoprefixer";
import vike from "vike/plugin";
import {compression} from "vite-plugin-compression2";

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
    vike(),
    vuetify({
      autoImport: true,
    }),
    nodePolyfills({exclude: ['module']}),
    compression({
      include: /\.(html|xml|css|json|js|mjs|svg)$/i,
      // eslint-disable-next-line no-control-regex
      exclude: [/\x00/, /dist\/server\//],
      threshold: 1024 // Only compress files larger than 1KB
    })  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "source-map-js": "source-map",
      'query-builder-vue-3': path.resolve(__dirname, 'src/utils/query-builder-vue-3/dist/query-builder-vue-3.js'),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".svg"],
  },
  optimizeDeps: {
    include: ['vue-code-highlight', 'highcharts', 'highcharts-vue'],
  },
  ssr: {
    //  Crucial for Vike + Vuetify to prevent SSR module resolution errors
    noExternal: ['vue-code-highlight', 'highcharts', 'highcharts-vue', 'vuetify'],
  },
  define: {
    'module.exports': '{}'
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
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/vue-code-highlight/, /node_modules/]
    },
    rollupOptions: {
      // onwarn(warning, warn) {
      //   if (warning.code === 'COMMONJS_VARIABLE_IN_ESM') return;
      //   warn(warning);
      // },
      output: {
        format: "es",
        inlineDynamicImports: false,
        // manualChunks: {
        //     'vendor-vuetify': ['vuetify'],
        // },
      },
    },
    modulePreload: false,
  }
});