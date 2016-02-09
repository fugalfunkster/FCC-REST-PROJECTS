var express = require('express');
var multer = require('multer');
var app = express();

var upload = multer().single('the-file');

app.use(express.static('public'));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File size is " + req.file.size + "bytes.");
    });
});

app.listen(8080, function(){
    console.log("listening on port 8080");
});
