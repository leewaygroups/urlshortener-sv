var dbInterface = require('./db');

/**
 * Keep private methods and properties private within a module.
 */
var examples = {
  "creation usage": "Ex1: https://little-url.herokuapp.com/new/https://www.google.com , Ex2: https://little-url.herokuapp.com/new/http://foo.com:80",
  "creation output": {
    original_url: "http://foo.com:80",
    short_url: "https://little-url.herokuapp.com/8170"
  }
};

var failedMsg = {
  mesage: "request param is either an invalid url or invalid short url",
  usage_example: examples
};

var isValidUrl = function (str) {
  //See  https://gist.github.com/dperini/729294
  var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return regex.test(str);
};

var isValidShortUrl = function (str) {
  return dbInterface.findUrlByLink(str);
};

var urlExists = function (url) {
  /**
   * url could be original or shortened url
   *
   * if its exists
   * return {
   *    exists: true,
   *    maxCount: totalCount,
   *    original_url: url,
   *    short_url: url
   * }
   *
   *
   * if not
   * return {
   *    exists: false,
   *    maxCount: totalCount
   * }
   */
  return dbInterface.findUrlByLink(url);
};

var shortenUrl = function (param, count) {
  return dbInterface.addUrl({
    original_url: param,
    short_url: count.toString(2)
  });
};

/**
 * Export only public methods and properties as interfaces in a module
 */
module.exports = {
  defaultResponse: function () {
    return { message: "Welcome to freecode-camp url shortener project", examples: examples };
  },

  handleResponse: function (req, res) {
    var inputUrl = req.originalUrl.substr(1);
    if (isValidUrl(inputUrl)) {
      urlExists(inputUrl).then(function (data) {
        if (!data.maxCount >= 0) {
          !data.exists
            ? shortenUrl(inputUrl, data.maxCount + 1).then(function (data) {
              data.original_url
              ? res.json({ original_url: data.original_url, short_url: data.short_url })
              : res.json(failedMsg);
            })
            : res.json({ original_url: data.original_url, short_url: data.short_url });
        } else {
          res.json(failedMsg);
        }
      });
    } else {
      urlExists(inputUrl).then(function (data) {
        if (data && data.short_url) {
          res.json({ original_url: data.original_url, short_url: data.short_url });
        } else {
          res.json(failedMsg);
        }
      });
    }
  }
};
