// Karma configuration

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',

        // frameworks to use
        frameworks: ['jasmine', 'systemjs'],

        // list of files / patterns to load in the browser
        files: [],

        systemjs: {

            configFile: 'system.config.js',

            // File patterns for your application code, dependencies, and test suites
            files: [
                'node_modules/babel-core/browser.js',
                'bower_components/**/*',
                './*.js'
            ],

            config: {
                transpiler: 'babel',
                map: {
                    'babel': 'node_modules/babel-core/browser.js'
                }
            }
        },

        // list of files to exclude
        exclude: [
            'bower_components/**/*.spec.js'
        ],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'block.js': ['coverage']
        },

        coverageReporter: {
            type : 'lcovonly',
            dir : 'reporters',
            subdir : '.'
        },

        junitReporter: {
            outputFile: 'reporters/junit.xml'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
