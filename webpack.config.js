const VueLoaderPlugin = require("vue-loader");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const WebpackBundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
  mode: "development",
  module: {
    resolve: {
      alias: {
        vue: "@vue/compat",
      },
    },
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        },
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/,
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "import.meta.env": dotenv.parsed,
      __VUE_OPTIONS_API__: true, // at the moment, many Vue components still use the Vue Options API
      __VUE_PROD_DEVTOOLS__: false, // do not enable devtools support in production
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // https://github.com/vuejs/vue-cli/pull/7443
    }),
    new WebpackBundleAnalyzerPlugin(),
  ],
};
