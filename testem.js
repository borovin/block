/* eslint camelcase: 0 */

module.exports = {
    src_files: ['tests/*', 'view.js'],
    serve_files: 'tests/*',
    test_page: 'tools/testem.mustache',
    launch_in_ci: ['PhantomJS'],
    reporter: 'dot'
};
