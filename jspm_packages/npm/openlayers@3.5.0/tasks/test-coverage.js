/* */ 
(function(process) {
  var fs = require("fs");
  var istanbul = require("istanbul");
  var wrench = require("wrench");
  var path = require("path");
  var glob = require("glob");
  var runTestsuite = require("./test").runTests;
  var dir = path.join(__dirname, '../src');
  var backupDir = path.join(__dirname, '../src-backup');
  var instrumentedDir = path.join(__dirname, '../src-instrumented');
  var coverageDir = path.join(__dirname, '../coverage');
  var instrumenter = new istanbul.Instrumenter();
  var reporter = new istanbul.Reporter(false, coverageDir);
  var collector = new istanbul.Collector();
  var copyOpts = {
    forceDelete: true,
    excludeHiddenUnix: false,
    preserveFiles: false,
    preserveTimestamps: true,
    inflateSymlinks: false
  };
  var log = function(msg) {
    process.stdout.write(msg + '\n');
  };
  var deleteFolderRecursive = function(p) {
    if (fs.existsSync(p)) {
      fs.readdirSync(p).forEach(function(file, index) {
        var curPath = path.join(p, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(p);
    }
  };
  var setupBackupAndInstrumentationDir = function() {
    if (!fs.existsSync(backupDir)) {
      log('• create directory for backup of src: ' + backupDir);
      fs.mkdirSync(backupDir);
    }
    if (!fs.existsSync(instrumentedDir)) {
      log('• create directory for instrumented src: ' + instrumentedDir);
      fs.mkdirSync(instrumentedDir);
    }
    log('• copy src files to backup folder');
    wrench.copyDirSyncRecursive(dir, backupDir, copyOpts);
    log('• copy src files to instrumentation folder');
    wrench.copyDirSyncRecursive(dir, instrumentedDir, copyOpts);
  };
  var revertBackupAndInstrumentationDir = function() {
    log('• copy original src back to src folder');
    wrench.copyDirSyncRecursive(backupDir, dir, copyOpts);
    log('• delete backup directory');
    deleteFolderRecursive(backupDir);
    log('• delete instrumentation directory');
    deleteFolderRecursive(instrumentedDir);
  };
  var collectAndWriteCoverageData = function(code) {
    log('• collect data from coverage.json');
    var coverageFile = path.join(__dirname, '../coverage/coverage.json');
    var coverageJson = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    collector.add(coverageJson);
    reporter.addAll(['lcovonly', 'html']);
    revertBackupAndInstrumentationDir();
    log('• write report from collected data');
    reporter.write(collector, true, function() {
      process.exit(0);
    });
  };
  var foundAllJavaScriptSourceFiles = function(err, files) {
    if (err) {
      process.stderr.write(err.message + '\n');
      process.exit(1);
    }
    log('• instrumenting every src file');
    var cnt = 0;
    files.forEach(function(file) {
      cnt++;
      var content = fs.readFileSync(file, 'utf-8');
      var re = new RegExp('/src/', 'g');
      var m,
          match;
      while ((m = re.exec(file)) !== null) {
        match = m;
      }
      var outfile = file.substr(0, match.index) + '/src-instrumented/' + file.substr(match.index + '/src/'.length);
      var instrumented = instrumenter.instrumentSync(content, file);
      fs.writeFileSync(outfile, instrumented);
      if (cnt % 10 === 0) {
        log('  • instrumented ' + cnt + ' files');
      }
    });
    log('  • done. ' + cnt + ' files instrumented');
    log('• copy instrumented src back to src folder');
    wrench.copyDirSyncRecursive(instrumentedDir, dir, copyOpts);
    log('• run test suite on instrumented code');
    runTestsuite(true, collectAndWriteCoverageData);
  };
  var main = function() {
    setupBackupAndInstrumentationDir();
    glob(dir + '/**/*.js', {}, foundAllJavaScriptSourceFiles);
  };
  if (require.main === module) {
    main();
  }
  module.exports = main;
})(require("process"));
