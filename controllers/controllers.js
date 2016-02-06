var express = require('express');
var multer = require('multer');
var upload = multer().single('the-file');

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
      var resObj = {};
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

  return {
    dateController: dateController,
    userInfoController: userInfoController,
    uploadController: uploadController,
  };

};

module.exports = controllers;
