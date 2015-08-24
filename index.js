var fs = require('fs');
var Q = require('q');
var express = require('express');
var moment = require('moment');
require('moment-range');

var app = express();

app.use(express.static('public'));

app.get('/data', function (req, res) {
    var start = moment(req.query.start);
    var end = moment(req.query.end);

    var files = [];
    moment.range(start, end).by('minute', function (date) {
        var p = Q.Promise(function (resolve, reject) {
            fs.readFile('data/' + date.format('YYYY-MM-DDTHH-mm') + '.json', function (err, buffer) {
                if (err) reject(err);
                else resolve({'date': date.format('YYYY-MM-DDTHH:mm'), 'buffer': buffer});
            });
        });
        files.push(p);
    });

    Q.all(files).then(function (files) {
        var dates = files.map(function (file) {
            var data = JSON.parse(file.buffer.toString());
            var indices = data.indices.map(function (index) {
                return {'name': index.name, 'price': parseFloat(index.value.price.replace(/,/g, ''))};
            });

            return {
                'date': file.date,
                'indices': indices
            };
        });
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
