module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-docs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.initConfig({
        docs: {
            readme: {
                options: {
                    template: 'README.ejs'
                },
                files : {
                    'README.md': 'index.js'
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            local: {
                reporters: 'mocha'
            },
            ci: {
                reporters: ['coverage', 'mocha']
            }
        },
        eslint: {
            src: ['index.js']
        }
    });

    grunt.registerTask('test', ['karma:local', 'eslint']);
    grunt.registerTask('test-ci', ['karma:ci', 'eslint']);

};