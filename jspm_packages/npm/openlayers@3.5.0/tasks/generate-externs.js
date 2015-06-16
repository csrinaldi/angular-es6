/* */ 
(function(process) {
  var fs = require("fs");
  var path = require("path");
  var async = require("async");
  var fse = require("fs-extra");
  var nomnom = require("nomnom");
  var generateInfo = require("./generate-info");
  var googRegEx = /^goog\..*$/;
  function getInfo(callback) {
    generateInfo(function(err) {
      if (err) {
        callback(new Error('Trouble generating info: ' + err.message));
        return ;
      }
      var info = require("../build/info.json!systemjs-json");
      callback(null, info.typedefs, info.symbols, info.externs, info.base);
    });
  }
  function generateExterns(typedefs, symbols, externs, base) {
    var lines = [];
    var processedSymbols = {};
    var constructors = {};
    var constructorOptionsTypes = {};
    function addNamespaces(name) {
      var parts = name.split('.');
      parts.pop();
      var namespace = [];
      parts.forEach(function(part) {
        namespace.push(part);
        var partialNamespace = namespace.join('.');
        if (!(partialNamespace in processedSymbols || partialNamespace in constructors)) {
          lines.push('/**');
          lines.push(' * @type {Object}');
          lines.push(' */');
          lines.push(nameToJS(partialNamespace) + ';');
          lines.push('\n');
        }
      });
    }
    function nameToJS(name) {
      processedSymbols[name] = true;
      if (name.indexOf('.') === -1) {
        name = 'var ' + name;
      }
      return name;
    }
    function findConstructorOptionsTypes(types) {
      types.forEach(function(type) {
        if (type.match(/^ol\..*Options$/)) {
          constructorOptionsTypes[type] = true;
        }
      });
    }
    function processSymbol(symbol) {
      addNamespaces(symbol.name.split('#')[0]);
      var name = symbol.name;
      if (name.indexOf('#') > 0) {
        name = symbol.name.replace('#', '.prototype.');
        var constructor = symbol.name.split('#')[0];
        if (!(constructor in constructors)) {
          constructors[constructor] = true;
          lines.push('/**');
          lines.push(' * @constructor');
          lines.push(' */');
          lines.push(nameToJS(constructor) + ' = function() {};');
          lines.push('\n');
        }
      }
      lines.push('/**');
      if (symbol.kind === 'class') {
        constructors[name] = true;
        lines.push(' * @constructor');
        if (symbol.extends && !googRegEx.test(symbol.extends)) {
          lines.push(' * @extends {' + symbol.extends + '}');
        }
      }
      if (symbol.types) {
        lines.push(' * @type {' + symbol.types.join('|') + '}');
      }
      var args = [];
      if (symbol.params) {
        symbol.params.forEach(function(param) {
          findConstructorOptionsTypes(param.types);
          args.push(param.name);
          lines.push(' * @param {' + (param.variable ? '...' : '') + param.types.join('|') + (param.optional ? '=' : '') + (param.nullable ? '!' : '') + '} ' + param.name);
        });
      }
      if (symbol.returns) {
        lines.push(' * @return {' + (symbol.returns.nullable ? '!' : '') + symbol.returns.types.join('|') + '}');
      }
      if (symbol.template) {
        lines.push(' * @template ' + symbol.template);
      }
      lines.push(' */');
      if (symbol.kind === 'function' || symbol.kind === 'class') {
        lines.push(nameToJS(name) + ' = function(' + args.join(', ') + ') {};');
      } else {
        lines.push(nameToJS(name) + ';');
      }
      lines.push('\n');
    }
    externs.forEach(processSymbol);
    base.forEach(processSymbol);
    symbols.forEach(processSymbol);
    typedefs.forEach(function(typedef) {
      delete constructorOptionsTypes[typedef.name];
      addNamespaces(typedef.name);
      lines.push('/**');
      lines.push(' * @typedef {' + typedef.types.join('|') + '}');
      lines.push(' */');
      lines.push(nameToJS(typedef.name) + ';');
      lines.push('\n');
    });
    Object.keys(constructorOptionsTypes).forEach(function(key) {
      lines.push('/**');
      lines.push(' * No `@api` annotation for `' + key + '`, use `Object`.');
      lines.push(' * @typedef {Object}');
      lines.push(' */');
      lines.push(nameToJS(key) + ';');
      lines.push('\n');
    });
    return lines.join('\n');
  }
  function main(callback) {
    async.waterfall([getInfo, function(typedefs, symbols, externs, base, done) {
      var code,
          err;
      try {
        code = generateExterns(typedefs, symbols, externs, base);
      } catch (e) {
        err = e;
      }
      done(err, code);
    }], callback);
  }
  if (require.main === module) {
    var options = nomnom.options({output: {
        position: 0,
        required: true,
        help: 'Output path for the generated externs file.'
      }}).parse();
    async.waterfall([main, fse.outputFile.bind(fse, options.output)], function(err) {
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
