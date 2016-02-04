var express = require('express');

var routes = function() {

  var router = express.Router();

  router.route('/:date')
    .get(function(req, res){
      var returnObj = {};
      var dateIn = req.params.date;
      var parsedDate = Date.parse(dateIn);
      if(isNaN(parsedDate)){
        returnObj.unix = dateIn;
        var newDate = new Date();
        newDate.setTime(dateIn);
        var options = {year: 'numeric', month: 'long', day: 'numeric' };
        returnObj.normal = newDate.toLocaleDateString('en-US', options);
      } else {
        returnObj.unix = parsedDate;
        returnObj.normal = dateIn;
      }
      res.send(returnObj);
    });

  router.route('/userinfo')
    .get(function(req, res){
      var resObj = {};
      resObj.ipaddress = req.ip;
      resObj.language = req.get("Accept-Language").slice(0,5);
      var regEx = new RegExp(/\(.+?\)/);
      var userSoftware = regEx.exec(req.get("User-Agent"))[0];
      resObj.software = userSoftware.slice(1, userSoftware.length - 1);

      response.send(resObj);
    });
  
    return router;

}

module.exports = routes;
