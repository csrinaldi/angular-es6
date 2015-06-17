/*var WebSocketServer = require('websocket').server;
 var http = require('http');

 var server = http.createServer(function(request, response) {
 // process HTTP request. Since we're writing just WebSockets server
 // we don't have to implement anything.
 });
 server.listen(1337, function() { });

 // create the server
 wsServer = new WebSocketServer({
 httpServer: server
 });

 // WebSocket server
 wsServer.on('request', function(request) {
 var connection = request.accept(null, request.origin);

 // This is the most important callback for us, we'll handle
 // all messages from users here.
 connection.on('message', function(message) {
 if (message.type === 'utf8') {
 console.log(message);
 }
 });

 connection.on('close', function(connection) {
 console.log("close WS");
 });
 });*/

var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var gcm = require('node-gcm');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());


var subscription = {};

app.get('/api/hello', function (req, res) {

  var sender = new gcm.Sender("AIzaSyCmxbldSgpq7nGkaBtUig__8TcwsQECkqk");
  var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      key1: 'message1',
      key2: 'message2'
    }
  });

  message.addData('key1','message1');

  var registrationIds = [subscription.subscriptionId];

  sender.sendNoRetry(message, registrationIds, function(err, result) {
    if(err){
      console.log("Return Error");
      console.log(err);
      res.status(400).json(err);
    }
    else {
      console.log("Return OK");
      console.log(result);
      console.log("---------");
      res.send();
    }
  });
});

app.post('/api/notifications', function (req, res) {
  subscription = req.body.subscription;
  console.log("Subscription is loaded");
  console.log(subscription);
  res.send();
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

//curl --header "Authorization: key=AIzaSyBBh4ddPa96rQQNxqiq_qQj7sq1JdsNQUQ" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"APA91bFRh8C_9EV34VxnBjK4PBq2ZaZxn02CUHq9SOGltz0J_2afGoXQDksKBV5Wv5fhzLwdnOKEpy-3YOXu-qcjz1nPXlx16Y6D0idLqNXJAUHeoJtQKlsuzR-CEQYhTGG-sr7FQyLf_Iy66NuniXhIbByzQps6frrgKPI3Z0Q5DEbsxEEvrP8\"]}"
