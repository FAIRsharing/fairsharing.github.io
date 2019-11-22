let webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine', 'chai'],

        files: [
            {
                pattern: './src/**/*.spec.js',
                type: 'module'
            }
        ],

        webpack: webpackConfig,
        reporters: ['progress'],
        browsers: ['ChromeHeadless'],
        preprocessors: {
            'src/**/*spec.js': ['webpack'],
        },

        plugins: [
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            require('karma-jasmine'),
            require('karma-coverage'),
            require('karma-spec-reporter'),
            require('karma-chrome-launcher'),
            require('karma-chai')
        ],

        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, './coverage/'),
            reports: ['html', 'text-summary'],
            fixWebpackSourcePaths: true
        },
    })
};

