var express = require('express'),
    app = express();

app.use(express.static(__dirname));

app.use(function(req, res) {

    var files = ['.js', '.ejs', '.ico'],
        notFound = false;

    files.forEach(function(file){
        if (req.path.indexOf(file) > 0 && req.path.indexOf(file) ===  (req.path.length - file.length)){
            notFound = true;
        }
    });

    if (notFound){
        res.sendStatus(404);
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

module.exports = app;
