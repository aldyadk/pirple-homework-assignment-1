//Define the handlers
var handlers = {};

//Hello handler
handlers.hello = (data,callback) => {
  callback(200,{response:`Hello there, ${data.queryStringObject.name ? data.queryStringObject.name : 'stranger' }!`});
};

//Not found handler
handlers.notFound = (data,callback) => {
  callback(404);
};

//Define a request router
var route = {
  'hello': handlers.hello,
}

var router = trimmedPath => {
  return typeof(route[trimmedPath]) !== 'undefined' ? route[trimmedPath] : handlers.notFound;
}

module.exports = router;