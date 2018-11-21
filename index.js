/*
* Primary file for the API
*
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');
const router = require('./router');

//HTTP server
var httpServer = http.createServer( (req,res) => {
  //Get URL and parse it
  var parsedUrl = url.parse(req.url,true);
  
  //Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  
  //Get the query string as an object
  var queryStringObject = parsedUrl.query;
  
  //Get http method
  var method = req.method.toLowerCase();
  
  //Get the headers as an object
  var headers = req.headers;
  
  //Get the payload, if any
  var decoder = new StringDecoder();
  var payload = '';
  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();
    
    //chose handler
    var chosenHandler = router(trimmedPath)
    
    //construct data object to send 
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': payload,
    }
    
    //Route the request to the handler specified in the router
    chosenHandler(data, (statusCode,payload) => {
      
      //use status code provided or use 200 as the default
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      
      //use payload provided or default to {}
      payload = typeof(payload) == 'object' ? payload : {};
      
      //convert the payload object to string
      var payloadString = JSON.stringify(payload);
      
      //Send the response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      
      //Log the response
      console.log('Returning with this response: ',statusCode,payloadString);
    });
    
  })
});

//start sever and listen on http port
httpServer.listen(config.port, () => {
  console.log(`listening on port ${config.port} in ${config.envName} environment` )
})


