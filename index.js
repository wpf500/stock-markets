var common = require('./common');
var express = require('express');
var moment = require('moment');

var app = express();

app.use(express.static('public'));

app.get('/data', function (req, res) {
    var start = moment(req.query.start);
    var end = moment(req.query.end);

    common.indices(start, end).then(function (dates) {
        res.send(dates);
    }).fail(function (reason) {
        res.status(404).send('Failed ' + reason);
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
