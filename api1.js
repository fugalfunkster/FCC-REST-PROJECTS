var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.enable('trust proxy');

app.get('/', function(request, response){
    var resObj = {};
    resObj.ipaddress = request.ip;
    resObj.language = request.get("Accept-Language").slice(0,5);
    var regEx = new RegExp(/\(.+?\)/);
    var userSoftware = regEx.exec(request.get("User-Agent"))[0];
    resObj.software = userSoftware.slice(1, userSoftware.length - 1)

    response.send(resObj);
});

app.listen(8080, function(){
    console.log("Listening on port 8080");
})