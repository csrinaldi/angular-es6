/* */ 
(function(process) {
  var fs = require("fs");
  var path = require("path");
  var async = require("async");
  var fse = require("fs-extra");
  var nomnom = require("nomnom");
  var generateInfo = require("./generate-info");
  function getConfig(configPath, callback) {
    if (configPath) {
      fs.readFile(configPath, function(err, data) {
        if (err) {
          callback(err);
          return ;
        }
        var obj;
        try {
          obj = JSON.parse(String(data));
        } catch (err2) {
          callback(new Error('Trouble parsing file as JSON: ' + configPath));
          return ;
        }
        var patterns = obj.exports;
        if (patterns && !Array.isArray(patterns)) {
          callback(new Error('Expected an exports array, got: ' + patterns));
          return ;
        }
        var namespace = obj.namespace;
        if (namespace && typeof namespace !== 'string') {
          callback(new Error('Expected an namespace string, got: ' + namespace));
          return ;
        }
        callback(null, obj);
      });
    } else {
      process.nextTick(function() {
        callback(null, {exports: ['*']});
      });
    }
  }
  function getSymbols(patterns, callback) {
    generateInfo(function(err) {
      if (err) {
        callback(new Error('Trouble generating info: ' + err.message));
        return ;
      }
      var symbols = require("../build/info.json!systemjs-json").symbols;
      callback(null, patterns, symbols);
    });
  }
  function filterSymbols(patterns, symbols, callback) {
    var matches = [];
    var lookup = {};
    symbols.forEach(function(symbol) {
      lookup[symbol.name] = symbol;
    });
    patterns.forEach(function(name) {
      var match = false;
      var pattern = (name.substr(-1) === '*');
      if (pattern) {
        name = name.substr(0, name.length - 1);
        symbols.forEach(function(symbol) {
          if (symbol.name.indexOf(name) === 0) {
            matches.push(symbol);
            match = true;
          }
        });
      } else {
        var symbol = lookup[name];
        if (symbol) {
          matches.push(symbol);
          match = true;
        }
      }
      if (!match) {
        var message = 'No matching symbol found: ' + name + (pattern ? '*' : '');
        callback(new Error(message));
      }
    });
    callback(null, matches);
  }
  function formatSymbolExport(name, namespace) {
    return 'goog.exportSymbol(\n' + '    \'' + name + '\',\n' + '    ' + name + (namespace ? ',\n    ' + namespace : '') + ');\n';
  }
  function formatPropertyExport(name) {
    var parts = name.split('#');
    var prototype = parts[0] + '.prototype';
    var property = parts[1];
    return 'goog.exportProperty(\n' + '    ' + prototype + ',\n' + '    \'' + property + '\',\n' + '    ' + prototype + '.' + property + ');\n';
  }
  function generateExports(symbols, namespace) {
    var blocks = [];
    var requires = {};
    symbols.forEach(function(symbol) {
      symbol.provides.forEach(function(provide) {
        requires[provide] = true;
      });
      var name = symbol.name;
      if (name.indexOf('#') > 0) {
        blocks.push(formatPropertyExport(name));
      } else {
        blocks.push(formatSymbolExport(name, namespace));
      }
    });
    blocks.unshift('\n');
    Object.keys(requires).sort().reverse().forEach(function(name) {
      blocks.unshift('goog.require(\'' + name + '\');');
    });
    blocks.unshift('/**\n' + ' * @fileoverview Custom exports file.\n' + ' * @suppress {checkVars}\n' + ' */\n');
    return blocks.join('\n');
  }
  function main(config, callback) {
    async.waterfall([getSymbols.bind(null, config.exports), filterSymbols, function(symbols, done) {
      var code,
          err;
      try {
        code = generateExports(symbols, config.namespace);
      } catch (e) {
        err = e;
      }
      done(err, code);
    }], callback);
  }
  if (require.main === module) {
    var options = nomnom.options({
      output: {
        position: 0,
        required: true,
        help: 'Output file path'
      },
      config: {
        abbr: 'c',
        help: 'Path to JSON config file',
        metavar: 'CONFIG'
      }
    }).parse();
    async.waterfall([getConfig.bind(null, options.config), main, fse.outputFile.bind(fse, options.output)], function(err) {
      if (err) {
        process.stderr.write(err.message + '\n');
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  }
  module.exports = main;
})(require("process"));
