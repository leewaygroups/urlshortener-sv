var mongoose = require('mongoose');
var Q = require('q');
//var _ = require('underscore');

var mongoUri = process.env.MONGO_URI || 'mongodb://localhost/test';
mongoose.connect(mongoUri);

var UrlSchema = mongoose.Schema({
  original_url: String,
  short_url: String
});

var Url = mongoose.model('Url', UrlSchema);

var addUrl = function (url) {
  var deferred = Q.defer();
  var UrlInstance = new Url(url);
  UrlInstance.save(function (err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

var findUrlByLink = function (link) {
  var defered = Q.defer();
  Url.findOne({ $or: [{ 'original_url': link }, { 'short_url': link }] }, function (err, url) {
    if (!err) {
      //deferred.resolve(url); url exists is either true or false
      getCount(url).then(function (result) {
        typeof result === 'number'
          ? defered.resolve({
            exists: url !== null,
            maxCount: result,
            original_url: url ? url.original_url : null,
            short_url: url ? url.short_url : null
          })
          : defered.reject(innerErr);
      });
    } else {
      defered.reject(err);
    }
  });

  return defered.promise;
}

var getCount = function (param) {
  var defered = Q.defer();
  if (param) {
    Url.count({ $or: [{ 'original_url': param.original_url }, { 'short_url': param.short_url }] }, function (err, count) {
      !err ? defered.resolve(count) : defered.reject(err);
    });
  } else {
    Url.count({}, function (err, count) {
      if(!err) {
        defered.resolve(count)
      }else{
        defered.reject(err);
      }
    });
  }

  return defered.promise;
}


module.exports = {
  addUrl: addUrl,
  findUrlByLink: findUrlByLink
};