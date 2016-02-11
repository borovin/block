var View = require('view');

new View({
    el: '#example',
    template: require('view/examples/template.ejs!view/loader')
});
