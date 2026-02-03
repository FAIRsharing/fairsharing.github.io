import {fileURLToPath} from "node:url";

import {URL} from "url";
import {defineConfig, mergeConfig} from "vite";
import viteConfig from "./vite.config.mjs";
import {configDefaults} from "vitest/config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      {
        name: 'stub-missing-css',
        resolveId(source) {
          // If the import path ends with these problem files, grab it!
          if (source.includes('prism-twilight.css') || source.includes('window.css')) {
            return 'virtual:stub-css';
          }
        },
        load(id) {
          // Return empty Javascript for the grabbed files
          if (id === 'virtual:stub-css') {
            return 'export default {}';
          }
        }
      }
    ],
    test: {
      server: {
        deps: {
          inline: ["vuetify", "simple-analytics-vue", "vue-gtag"],
        },
      },
      environment: "happy-dom",
      globals: true,
      setupFiles: ['./tests/setup.js'],
      exclude: [...configDefaults.exclude, "e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      transformMode: {
        web: [/\.[jt]sx$/],
      },
      include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        provider: "v8", // or 'istanbul'
        ignoreEmptyLines: true,
        thresholds: {
          autoUpdate: true,
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90
        },
        css: true,
        exclude: [
          "dist/*",
          "documentation/*",
          "src/documentation/process_doc.js",
          "src/store/index.js",
          "src/plugins/**",
          "src/router/**",
          "tests/*",
          ".eslintrc.js",
          "babel.config.js",
          "vite.config.mjs",
          "vitest.config.js",
          "vue.config.js",
          "webpack.config.js",
          "views/Records/NetworkGraph.vue",
          "src/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/index.js",
          "src/components/Records/Search/SaveSearch/StepperComponents/index.js",
          "src/components/Curators/index.js",
        ],
        reporter: ["html", "lcov", "text"],
        reportOnFailure: true,
      },
    },
  }),
);