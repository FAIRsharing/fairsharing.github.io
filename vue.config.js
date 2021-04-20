const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugin('CompressionPlugin').use(CompressionPlugin);
  },
  pwa: {
    name: 'FAIRsharing',
    short_name: 'FDHGF',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    start_url: "index.html",
    iconPaths: {
      favicon32: "assets/favicon.ico",
      favicon16: "assets/favicon.ico",
      favicon96:  "assets/favicon.ico"
    },
    icons:[],
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/registerServiceWorker.js"
    }
  }
};
