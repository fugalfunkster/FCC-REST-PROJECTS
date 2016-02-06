'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.enable('trust proxy');

var port = process.env.PORT || 8080;

var router = require('./routes/APIrouter')();

app.use(express.static('public'));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.use('/api', router);

app.listen(8080, function(){
  console.log("listening on port 8080");
});
