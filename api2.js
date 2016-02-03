'use strict';

var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;

mongo.connect('mongodb://localhost:27017/shorturls', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }

    var reRoutes = db.collection('routes');

    app.get(/^\/([^\\]+?)(?:\/(?=$))?$/, function (request, response) {

        var givenRoute = request.params[0];

        if (givenRoute === "favicon.ico"){
            response.end();
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
                        response.redirect(doc.originalurl);
                    } else {
                        console.log(doc);
                        response.send("Not a valid URL");
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
                            var newRoute = {"originalurl": data.ops[0].originalurl, "shorturl": "https://url-short-fugalfunkster.c9users.io/" + data.ops[0].shorturl};
                            response.send(newRoute);
                        }
                    });
                }
            });
        }

    });

    app.listen(8080, function() {
        console.log("Listening on port 8080!");
    });

});
