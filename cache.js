var common = require('./common');
var config = require('./config');
var Q = require('q');
var AWS = require('aws-sdk');
var moment = require('moment');

var s3 = new AWS.S3();
var s3putObject = s3.putObject.bind(s3);

function putObject(key, body) {
    var params = {
        Bucket: config.bucket,
        Key: config.key + key + '.json',
        Body: body,
        ACL: 'public-read',
        CacheControl: 'max-age=30',
        ContentType: 'application/json'
    };

    return Q.nfcall(s3putObject, params);
}

var ranges = [
    [moment.utc().startOf('day'), moment.utc(), moment.utc().format('YYYY-MM-DD')],
    [moment.utc().subtract(1, 'day'), moment.utc(), '24hr'],
    [moment.utc().subtract(1, 'hour'), moment.utc(), '1hr'],
    [moment.utc().subtract(2, 'hours'), moment.utc(), '2hr']
];

console.log(moment.utc().format());

ranges.forEach(function (range) {
    common.indices(range[0], range[1]).then(function (dates) {
        var indices = {};
        dates.forEach(function (date) {
            date.indices.forEach(function (index) {
                if (!indices[index.name]) indices[index.name] = [];
                indices[index.name].push({'date': date.date, 'indices': [index]});
            });
        });

        var allPromise = putObject('all_' + range[2], JSON.stringify(dates));
        var indexPromises = Object.keys(indices).map(function (indexName) {
            return putObject(indexName + '_' + range[2], JSON.stringify(indices[indexName]));
        });

        return Q.all(indexPromises.concat([allPromise]));
    }).then(function () {
        console.log('Put objects complete');
    }).done();
});
