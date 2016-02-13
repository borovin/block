var View = require('block');

new View({
    el: '#example',
    template: require('block/examples/template.ejs!ejsLoader')
});
