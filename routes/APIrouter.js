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

    return router;

}

module.exports = routes;
