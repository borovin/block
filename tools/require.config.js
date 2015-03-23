require.config({
    baseUrl: '/base/',
    paths: {
        'jquery': 'bower_components/jquery/dist/jquery.min'
    },

    map: {
        '*': {
            'underscore': 'bower_components/lodash/lodash'
        }
    }
});