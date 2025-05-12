const CompressionPlugin = require("compression-webpack-plugin");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  chainWebpack(config) {
    config.plugins.delete("prefetch");
    config.plugin("CompressionPlugin").use(CompressionPlugin);
    config.resolve.alias.set("vue", "@vue/compat");
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      });
      return definitions;
    });
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@use "@/styles/index.scss";`,
      },
    },
  },
});
