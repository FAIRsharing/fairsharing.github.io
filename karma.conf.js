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
        reporters: ['progress','coverage', 'coveralls', 'kjhtml'],
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
            require('karma-coveralls'),
            require('karma-chai'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
        ],

        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, './coverage/Angular8Test'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,

        coverageReporter: {
            type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
            dir: 'coverage/'
        }
    })
};

