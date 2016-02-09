var express = require('express');
var request = require('request');
var mongo = require('mongodb').MongoClient;
var app = express();

mongo.connect('mongodb://localhost:27017/imagesearch', function (err, db) {

    if(err){
        console.log("error connecting to DB");
    }
    else{
        console.log("DB running on 27017");
    }

    var searchDB = db.collection('searches');

    // TODO create a route to retrieve the last 10 searches
    app.get('/searched', function(req, res){
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


    app.get('/search/:query', function(req, res){

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
});

app.listen(8080, function(){
    console.log("listening on port 8080");
});

//from using REST example : https://cse.google.com:443/cse/publicurl?cx=013362456140012184558:m1ujqvblmwo
//my google search thing api key = AIzaSyBqj6TkeKTi9d5Ww7hnBsrhInD1VZ3Ejoc
//GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures
//combo 1 = https://www.googleapis.com/customsearch/v1?key=AIzaSyBqj6TkeKTi9d5Ww7hnBsrhInD1VZ3Ejoc&cx=013362456140012184558:m1ujqvblmwo&q=lectures
