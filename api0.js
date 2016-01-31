var express = require('express');
var app = express();

app.get('/:date', function(request, response){
  var returnObj = {};
  var dateIn = request.params.date;
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
  response.send(returnObj);
});


app.listen(8080, function(){
  console.log("listening on port 8080");
})
