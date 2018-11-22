var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Feedback = require('./api/models/arsenalModel'), //created model loading here
  bodyParser = require('body-parser');
  
  var port = 8000;
  var serverUrl = "127.0.0.1";
  
  var http = require("http");
  var path = require("path");
  var fs = require("fs");
  var checkMimeType = true;

 
  
  console.log("Starting web server at " + serverUrl + ":" + port);
  
// var browserify = require('browserify');
// var b = browserify();
// b.add('./browser/main.js');
// b.bundle().pipe(process.stdout);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/webdb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/arsenalRoutes'); //importing route
routes(app); //register the route

// var script = require('./js/script')
app.listen(port);


console.log('lab list RESTful API server started on: ' + port);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

var cors=require('cors');

app.use(cors({origin:true,credentials: true}));


