var express = require('express');
var util = require('./lib/appUtil.js');

var app = express();
var port = process.env.PORT || 4000;

/**
 * Its adviceable to keep api code as lean as possible.
 * All logics/data manipulations should be keep in a separate module/file
 * All CRUD operations should be keep in a saprate module/file as well
 *
 * BENEFITS:
 * 1. Saparation of concern
 * 2. Makes debuging easier
 * 3. You can easilier swap in/out modules
 * 4. Possible reusability across projects
 * 5. In real-life and larger projects, implementing module specific security security would be less complicated, etc.
 */

app.get('/', function (req, res) {
  res.json(util.defaultResponse());
});

app.get('/:urlParam', function (req, res) {
  if(req.originalUrl !== "/favicon.ico"){
     util.handleResponse(req, res);
  }
});

app.listen((process.env.PORT || 4000), function () {
  console.log('urlshortener service listening at port  ' + port);
});



