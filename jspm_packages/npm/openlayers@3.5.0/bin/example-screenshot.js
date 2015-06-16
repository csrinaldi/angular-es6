/* */ 
(function(process) {
  (function() {
    var page = require("webpage").create(),
        fs = require("fs"),
        system = require("system"),
        baseExamplesUrl = system.args[1],
        exampleDir = system.args[2],
        ignoreFiles = ['index.html'],
        intervalMillisecs = 25,
        renderMillisecs = 2000,
        curDir = fs.workingDirectory,
        exampleDirList = fs.list(exampleDir),
        pageindex = 0,
        fileName = '',
        htmlFiles = [],
        lenHtmlFiles = 0,
        loadInProgress = false;
    var util = {
      baseName: function(path) {
        var parts = path.split(fs.separator);
        return parts[parts.length - 1];
      },
      isHtmlFile: function(filename) {
        return (/\.html?$/).test(filename);
      },
      appendSlash: function(str) {
        return ((/\/$/).test(str)) ? str : str + '/';
      },
      buildUrl: function(baseurl, path) {
        var name = util.baseName(path),
            mode = 'raw';
        return util.appendSlash(baseurl) + name + '?mode=' + mode;
      },
      logProgress: function() {
        var doneSymbol = '-',
            todoSymbol = ' ',
            currentSymbol = '>',
            barStrLeft = '[',
            barStrRight = ']',
            progresStep = 5,
            totalSteps = Math.round(100 / progresStep),
            ratio = (lenHtmlFiles === 0) ? 0 : (pageindex / lenHtmlFiles),
            percent = (ratio === 0) ? 0 : ratio * 100,
            normalizedNumDone = Math.floor(ratio * totalSteps),
            normalizedNumTodo = totalSteps - normalizedNumDone,
            progressLine = '',
            i = 0;
        progressLine += barStrLeft;
        for (; i < normalizedNumDone; i++) {
          progressLine += doneSymbol;
        }
        for (i = 0; i < normalizedNumTodo; i++) {
          progressLine += (i === 0) ? currentSymbol : todoSymbol;
        }
        progressLine += barStrRight;
        if (percent < 10) {
          progressLine += '  ';
        } else if (percent < 100) {
          progressLine += ' ';
        }
        progressLine += ' ' + percent.toFixed(1) + ' % done';
        if (fileName !== '') {
          progressLine += ', ' + util.baseName(fileName) + '';
        }
        console.log(progressLine);
      }
    };
    for (var i = 0; i < exampleDirList.length; i++) {
      var fullpath = exampleDir + fs.separator + exampleDirList[i];
      if (fs.isFile(fullpath) && util.isHtmlFile(fullpath) && ignoreFiles.indexOf(util.baseName(fullpath)) === -1) {
        htmlFiles.push(fullpath);
      }
    }
    lenHtmlFiles = htmlFiles.length;
    console.log('Capturing ' + lenHtmlFiles + ' example screenshots.');
    var interval = setInterval(function() {
      if (!loadInProgress && pageindex < lenHtmlFiles) {
        util.logProgress();
        fileName = htmlFiles[pageindex];
        page.viewportSize = {
          width: 800,
          height: 600
        };
        page.clipRect = {
          top: 0,
          left: 0,
          width: page.viewportSize.width,
          height: page.viewportSize.height
        };
        page.open(util.buildUrl(baseExamplesUrl, htmlFiles[pageindex]));
      }
      if (pageindex == lenHtmlFiles) {
        util.logProgress();
        console.log(lenHtmlFiles + ' screenshots captured.');
        phantom.exit();
      }
    }, intervalMillisecs);
    page.onLoadStarted = function() {
      loadInProgress = true;
    };
    page.onLoadFinished = function() {
      var dest = exampleDir + fs.separator + util.baseName(fileName) + '.png';
      window.setTimeout(function() {
        loadInProgress = false;
        page.render(dest);
        pageindex++;
      }, renderMillisecs);
    };
  })();
})(require("process"));
