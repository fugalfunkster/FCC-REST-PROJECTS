var express = require('express');
var controllers = require('../controllers/controllers.js')();


var routes = function() {

  var router = express.Router();

  router.route('/date/:date')
    .get(controllers.dateController);

  router.route('/userinfo')
    .get(controllers.userInfoController);
  
    return router;

}

module.exports = routes;
