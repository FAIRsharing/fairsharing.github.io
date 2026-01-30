import {fileURLToPath} from "node:url";

import {URL} from "url";
import {defineConfig, mergeConfig} from "vite";

import viteConfig from "./vite.config.mjs";
import {configDefaults} from "vitest/config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      server: {
        deps: {
          inline: ["vuetify"],
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
        },
        css: true,
        exclude: [
          "dist/*",
          "documentation/*",
          "src/main.js",
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
