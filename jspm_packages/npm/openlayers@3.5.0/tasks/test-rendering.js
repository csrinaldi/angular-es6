/* */ 
(function(process) {
  var fs = require("fs");
  var path = require("path");
  var spawn = require("child_process").spawn;
  var slimerjs = require("slimerjs-edge");
  var serve = require("./serve");
  var listen = require("./test").listen;
  serve.createServer(function(err, server) {
    if (err) {
      process.stderr.write(err.message + '\n');
      process.exit(1);
    }
    listen(3001, 3005, server, function(err) {
      if (err) {
        process.stderr.write('Server failed to start: ' + err.message + '\n');
        process.exit(1);
      }
      var address = server.address();
      var url = 'http://' + address.address + ':' + address.port;
      var profile = path.join(__dirname, '../build/slimerjs-profile');
      var args = ['-profile', profile, path.join(__dirname, '../test_rendering/test.js'), url + '/test_rendering/index.html'];
      var child = spawn(slimerjs.path, args, {stdio: 'inherit'});
      child.on('exit', function(code) {
        var exitstatus = path.join(profile, 'exitstatus');
        fs.readFile(exitstatus, {encoding: 'utf-8'}, function(err, data) {
          if (err) {
            process.stderr.write('Error getting the exit status of SlimerJS' + '\n');
            process.stderr.write(err.stack + '\n');
            process.exit(1);
          } else {
            process.exit(data);
          }
        });
      });
    });
  });
})(require("process"));
