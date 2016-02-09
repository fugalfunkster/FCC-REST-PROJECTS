var express = require('express');
var multer = require('multer');
var upload = multer().single('the-file');
var mongo = require("mongodb").MongoClient;

var controllers = function() {

  var dateController = function(req, res) {
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
    };

  var userInfoController = function(req, res){
      var resObj = {};n
      resObj.ipaddress = req.ip;
      resObj.language = req.get("Accept-Language").slice(0,5);
      var regEx = new RegExp(/\(.+?\)/);
      var userSoftware = regEx.exec(req.get("User-Agent"))[0];
      resObj.software = userSoftware.slice(1, userSoftware.length - 1);

      res.send(resObj);
    };

  var uploadController = function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File size is " + req.file.size + "bytes.");
    });
  };

  var shortUrlController = function (req, res) {

    mongo.connect('mongodb://localhost:27017/api', function (err, db) {

      if (err) {
        throw new Error('Database failed to connect!');
      } else {
        console.log('MongoDB successfully connected on port 27017.');
      }

      var reRoutes = db.collection('shortURLs');

      var givenRoute = req.params.url;

      if (givenRoute === "favicon.ico"){
        res.end();
      } else {

        var urlRegEx = new RegExp(/(^(https?):\/\/[a-z]+(\.).+\S)/);
        var wwwRegEx = new RegExp(/(^[a-z]+(\.)[a-z,.]+\S)/);

        if(urlRegEx.test(givenRoute)){
          makeNewRoute();
        } else if (wwwRegEx.test(givenRoute)){
          givenRoute = "http://" + givenRoute;
          makeNewRoute();
        } else {
          console.log(givenRoute);
          doesRouteExist();
        }
      }

      function doesRouteExist(){
        var query = {"shorturl": parseInt(givenRoute)};
        reRoutes.findOne(query, function(err, doc){
          if (err) {
            throw new Error('route lookup failed');
          } else { 
            console.log(query);
            if (doc){
              console.log(doc.originalurl);
              res.redirect(doc.originalurl);
            } else {
              console.log(doc);
              res.send("Not a valid URL");
            }
          }
        });
      }

      function makeNewRoute(){
        reRoutes.count({}, function(err, data){
          if (err) {
            throw new Error('route count failed');
          } else {
            console.log(data);
            var count = data;
            reRoutes.insert({"originalurl" : givenRoute, "shorturl" : count}, function(err, data) {
              if (err) {
                throw new Error('makeNewRoute insert failed');
              } else {
                var newRoute = {"originalurl": data.ops[0].originalurl, "shorturl": "https://url-short-fugalfunkster.c9users.io/"  + data.ops[0].shorturl};
                res.send(newRoute);  
              }
            });
          }
        });
      }

    });

  };

  return {
    dateController: dateController,
    userInfoController: userInfoController,
    uploadController: uploadController,
    shortUrlController: shortUrlController,
  };

};

module.exports = controllers;
