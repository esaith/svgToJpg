module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'browserify'],
        files: [
          '*browserAction.spec.js',
          '*browserAction.js'
        ],

        plugins: [
            'karma-ng-html2js-preprocessor',
            'karma-jasmine',
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'
            //'karma-firefox-launcher',
            //'karma-opera-launcher',
            //'karma-ie-launcher',
        ],

        ngHtml2JsPreprocessor: {
            prependPrefix: '',
            moduleName: '',
            cacheIdFromPath: function (filepath) {
                return filepath;
            },
        },

        exclude: [
        ],
        preprocessors: {
        },

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: config.browsers === 'PhantomJS' ? ['PhantomJS'] : config.browsers === 'Chrome' || config.browsers === 'chrome' ? ['Chrome'] : ['Chrome', 'Firefox', 'IE'],
        singleRun: config.singleRun ? true : false,
        concurrency: Infinity
    })
}
