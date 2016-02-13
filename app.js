/* eslint no-console: 0 */

var express = require('express');
var playground = require('playground');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use('/playground', playground);

app.listen(port, function () {
    console.log('Server started at port: ' + port);
});
