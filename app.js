"use strict";
var express = require('express');
var axios = require('axios');
var app = express();
var port = 3030;
var STREAMLABS_API_BASE = 'https://www.streamlabs.com/api/v1.0';
var token = '';
app.get('/', function (req, res) {
    var authorize_url = STREAMLABS_API_BASE + "/authorize?";
    var params = {
        'client_id': 'VJh9fjnod8FYouU5fTQP8kAh75GDLWxN2s2fgTDR',
        'redirect_uri': 'http://localhost:3030/auth',
        'response_type': 'code',
        'scope': 'donations.read+donations.create',
    };
    authorize_url += Object.keys(params).map(function (k) { return k + "=" + params[k]; }).join('&');
    res.send("<a href=\"" + authorize_url + "\">Authorize with Streamlabs!</a>");
});
app.get('/auth', function (req, resp) {
    var code = req.query.code;
    axios.post(STREAMLABS_API_BASE + "/token?", {
        'grant_type': 'authorization_code',
        'client_id': 'VJh9fjnod8FYouU5fTQP8kAh75GDLWxN2s2fgTDR',
        'client_secret': 'mzBoq1f4eCOM4aV1M0qFpzVA2Kgzkzp1IZAr57Re',
        'redirect_uri': 'http://localhost:3030/auth',
        'code': code
    }).then(function (response) {
        token = response.data.access_token;
        resp.redirect('/');
    });
});
app.get('/user', function (req, res) {
    axios.get(STREAMLABS_API_BASE + "/user?access_token=" + token)
        .then(function (response) {
        console.log(response.data);
        res.send(response.data);
    });
});
app.post('/donation/:name/:message/:amount/:currecy/:id', function (req, res) {
    var data = {
        name: req.params.name,
        message: req.params.message,
        identifier: req.params.id,
        amount: req.params.amount,
        currency: req.params.currecy,
        access_token: token,
        skip_alert: 'no'
    };
    axios.post(STREAMLABS_API_BASE + "/donations", data)
        .then(function (response) {
        console.log(response.data);
        res.send(response.data);
    });
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
