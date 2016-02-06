var express = require('express');
var controllers = require('../controllers/controllers.js')();
var path = require('path');

var routes = function() {

  var router = express.Router();

  router.route('/date/:date')
    .get(controllers.dateController);

  router.route('/userinfo')
    .get(controllers.userInfoController);
  
  router.route('/upload')
    .get(function(req,res){
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    })
    .post(controllers.uploadController);


    return router;

}

module.exports = routes;
