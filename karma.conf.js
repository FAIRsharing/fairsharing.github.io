let webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'src/**/*spec.js',

        ],

        webpack: webpackConfig,
        reporters: ['progress', 'coverage'],
        browsers: ['ChromeHeadless'],
        preprocessors: {
            'src/**/*spec.js': ['webpack'],
            'src/**/*.js': ['coverage', 'webpack']
        },

        plugins: [
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            require('karma-jasmine'),
            require('karma-spec-reporter'),
            require('karma-chrome-launcher'),
            require('karma-coverage')
        ],

        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        coverageReporter: {
            dir : 'coverage/',
            reporters: [
                { type: 'lcovonly', subdir: 'report-lcov' },
                { type: 'text', file : 'coverage.txt'}
            ]
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
    })
};

