var webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        base: '',
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            { pattern: 'example/*', included: false, watched: false },
            'test/*.js'
        ],
        preprocessors: {
            'js/*.js': ['webpack', 'sourcemap'],
            'test/*.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha'],
        port: 9000,
        colors: true,
        webpack: webpackConfig
    });
};