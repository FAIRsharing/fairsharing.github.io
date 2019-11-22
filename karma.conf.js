let webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'chai'],

        files: [
            {
                pattern: './tests/*.spec.js',
                type: 'module'
            }
        ],

        webpack: webpackConfig,
        reporters: ['progress'],
        browsers: ['Chrome'],
        preprocessors: {
            './tests/*spec.js': ['webpack'],
            './src/**/*.js': ['webpack'],
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

