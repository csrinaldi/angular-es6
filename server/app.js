// most basic dependencies
var express = require('express')
  , http = require('http')
  , os = require('os')
  , bodyParser = require('body-parser')
  , cors = require('express-cors');

// create the app
var app = express();
app.use(bodyParser());
app.use(cors({
  allowedOrigins: [
    'github.com', 'google.com', 'localhost:8000'
  ]
}));


//---------------------------------------
// mini app
//---------------------------------------
var openConnections = [];

// simple route to register the clients
app.get('/stats', function(req, res) {

  // set timeout as high as possible
  req.socket.setTimeout(Infinity);

  // send headers for event-stream connection
  // see spec for more information
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // push this res object to our global variable
  openConnections.push(res);

  // When the request is closed, e.g. the browser window
  // is closed. We search through the open connections
  // array and remove this connection.
  req.on("close", function() {
    var toRemove;
    for (var j =0 ; j < openConnections.length ; j++) {
      if (openConnections[j] == res) {
        toRemove =j;
        break;
      }
    }
    openConnections.splice(j,1);
    console.log(openConnections.length);
  });
});

setInterval(function() {
  // we walk through each connection
  openConnections.forEach(function(resp) {
    var d = new Date();
    resp.write('id: ' + d.getMilliseconds() + '\n');
    resp.write('data:' + createMsg() +   '\n\n'); // Note the extra newline
  });

}, 1000);

function createMsg() {
  msg = {};

  msg.hostname = os.hostname();
  msg.type = os.type();
  msg.platform = os.platform();
  msg.arch = os.arch();
  msg.release = os.release();
  msg.uptime = os.uptime();
  msg.loadaverage = os.loadavg();
  msg.totalmem = os.totalmem();
  msg.freemem = os.freemem();

  return JSON.stringify(msg);
}

// startup everything
http.createServer(app).listen(3000, function(){
  console.log("Express server listening on port " + 3000);
})
