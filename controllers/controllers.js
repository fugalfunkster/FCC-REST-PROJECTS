var express = require('express');
var multer = require('multer');
var upload = multer().single('the-file');
var request = require('request');
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

  var imageQueryController =  function(req, res){
       
    mongo.connect('mongodb://localhost:27017/api', function (err, db) {

      if(err){
        console.log("error connecting to DB");
      } else{
         console.log("DB running on 27017");
      }

      var searchDB = db.collection('searches');

      var projection = {"query": 1, "when": 1, "_id" : 0};
      var results = [];
      searchDB.find({}, projection).sort([["when",1]]).limit(10).toArray(function(err, docArray){
        if(err){
          console.log(err);
        }
        
        var results = [];
        docArray.forEach(function(doc){
          var timeStamp = new Date(doc.when);
          doc.when = timeStamp.toString();
          results.push(doc);
        });
       
        res.send(results);
      
      });
    });
  };

  var imageSearchController =  function(req, res){

    mongo.connect('mongodb://localhost:27017/imagesearch', function (err, db) {

      if(err){
        console.log("error connecting to DB");
      } else{
        console.log("DB running on 27017");
      }

      var searchDB = db.collection('searches');

      if(req.params.query === "favicon.ico"){
        return;
      }

      var query = req.params.query;
      var offset = parseInt(req.query.offset, 0);
      var timeStamp = Date.now();

      searchDB.insert({"query" : query, "when" : timeStamp}, function(err, doc){
        if (err){
          console.log("Error on DB Insert");
        } else {
          console.log("Sucessful DB Insert");
        }
      });

      var queryUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBqj6TkeKTi9d5Ww7hnBsrhInD1VZ3Ejoc&cx=013362456140012184558:m1ujqvblmwo&searchType=image&q=' + query;

      if(offset){
        queryUrl = queryUrl + "&start=" + offset;
      }

      request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var json = JSON.parse(body);
          var items  = [];
          json.items.forEach(function(each){
            items.push({"title": each.title, "snippet": each.snippet, "url" :each.link, "context": each.image.contextLink});
          });
          
          res.send(items);
          
        }
      });
    });
  };

  return {
    dateController: dateController,
    userInfoController: userInfoController,
    uploadController: uploadController,
    shortUrlController: shortUrlController,
    imageQueryController: imageQueryController,
    imageSearchController: imageSearchController
  };

};

module.exports = controllers;
