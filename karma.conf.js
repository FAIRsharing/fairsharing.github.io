let webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],

        files: [
            {
                pattern: './src/**/*.spec.js',
            },
        ],

        webpack: webpackConfig,
        reporters: ['spec', 'coverage'],
        browsers: ['ChromeHeadless'],
        preprocessors: {
            'src/**/*spec.js': ['webpack', 'sourcemap'],
            'src/**/*.js': ['coverage']
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
        coverageIstanbulReporter: {
            dir: './coverage/report',
            reports: ['html', 'lcov', 'text-summary'],
            fixWebpackSourcePaths: true
        },
        coverageReporter: {
            dir : 'coverage/',
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' }
            ]
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
    })
};

