/*jslint node: true */
'use strict';

var express = require('express');
var controllers = require('../controllers/controllers.js')();
var path = require('path');

var routes = function() {

  var router = express.Router();

  router.route('/')
    .get(function(req, res) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

  router.route('/date/:date')
    .get(controllers.dateController);

  router.route('/userinfo')
    .get(controllers.userInfoController);

  router.route('/upload')
    .get(function(req, res) {
      res.sendFile(path.join(__dirname, '../public', 'upload.html'));
    })
    .post(controllers.uploadController);

  router.route('/shorturl/:url')
    .get(controllers.shortUrlController);

  router.route('/search')
    .get(controllers.imageSearchController);

  router.route('/search/:query')
    .get(controllers.imageQueryController);

  return router;

};

module.exports = routes;
