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
        reporters: ['progress','coverage', 'coveralls'],
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
            require('karma-coveralls')
        ],

        coverageReporter: {
            type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
            dir: 'coverage/'
        }
    })
};

