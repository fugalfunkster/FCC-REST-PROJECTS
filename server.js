'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.enable('trust proxy');

var port = process.env.PORT || 8080;

var router = require('./routes/APIrouter')();

app.use('/api', router);

app.listen(port, function(){
  console.log("listening on port " + port);
});
