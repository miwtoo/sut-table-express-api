const express = require('express');
const request = require('request');
const iconv = require('iconv-lite');

const app = express();

const url = 'http://reg6.sut.ac.th/registrar/class_info_2.asp?backto=home&option=0&courseid=102112&coursecode=102112&acadyear=2561&semester=1&avs556675419=151'

app.get('/api/:coursecode/:group/:year/:semester', function (req, res) {
    res.json(
        req.params
    )
})

app.get('/api', function (req, res) {

    request({
        url: url,
        encoding: null
    }, function (error, response, body) {
        res.json(iconv.decode(body, 'win874'))
    });
})

const server = app.listen(8080, function () {
    const port = server.address().port;
    console.log('Server is running on port %s.', port);

})