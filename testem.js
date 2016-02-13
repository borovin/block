/* eslint camelcase: 0 */

module.exports = {
    src_files: ['tests/*', 'block.js'],
    serve_files: 'tests/*',
    test_page: 'tools/testem.mustache',
    launch_in_ci: ['PhantomJS']
};
