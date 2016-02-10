var fs = require('fs');
var Q = require('q');
var moment = require('moment');
require('moment-range');

function indices(start, end) {
    var filePromises = [];
    moment.range(start, end).by('minute', function (date) {
        var dateStr = date.format('YYYY-MM-DDTHH-mm');
        var p = Q.Promise(function (resolve, reject) {
            var fn = 'data/' + dateStr + '.json';
            fs.readFile(fn, function (err, buffer) {
                if (err) resolve({});
                else resolve({'date': dateStr, 'buffer': buffer});
            });
        });
        filePromises.push(p);
    });

    return Q.all(filePromises).then(function (files) {
        return files.filter(function (file) { return file.buffer; }).map(function (file) {
            var data = JSON.parse(file.buffer.toString());
            var indices = data.indices.map(function (index) {
                return {'name': index.name, 'price': parseFloat(index.value.price.replace(/,/g, ''))};
            });

            return {
                'date': file.date,
                'indices': indices
            };
        });

    }).fail(function (reason) {
        console.warn('Failed', reason);
    });
}

module.exports = {
    'indices': indices
};
