/* */ 
(function(Buffer, process) {
  var path = require("path");
  var Metalsmith = require("metalsmith");
  var handlebars = require("handlebars");
  var templates = require("metalsmith-templates");
  var marked = require("marked");
  var pkg = require("../package.json!systemjs-json");
  var markupRegEx = /([^\/^\.]*)\.html$/;
  var cleanupJSRegEx = /.*(goog\.require(.*);|.*renderer: common\..*,?)[\n]*/g;
  var requiresRegEx = /.*goog\.require\('(ol\.\S*)'\);/g;
  var isCssRegEx = /\.css$/;
  var isJsRegEx = /\.js$/;
  var srcDir = path.join(__dirname, '..', 'examples');
  var destDir = path.join(__dirname, '..', 'build', 'examples');
  var templatesDir = path.join(__dirname, '..', 'config', 'examples');
  function getRequires(src) {
    var requires = [];
    var match = requiresRegEx.exec(src);
    while (match) {
      requires.push(match[1]);
      match = requiresRegEx.exec(src);
    }
    return requires;
  }
  function getLinkToApiHtml(requires) {
    var lis = requires.map(function(symb) {
      var href = '../apidoc/' + symb + '.html';
      return '<li><a href="' + href + '" title="API documentation for ' + symb + '">' + symb + '</a></li>';
    });
    return '<ul class="inline">' + lis.join() + '</ul>';
  }
  function augmentExamples(files, metalsmith, done) {
    setImmediate(done);
    for (var filename in files) {
      var file = files[filename];
      var match = filename.match(markupRegEx);
      if (match && filename !== 'index.html') {
        if (!file.template) {
          throw new Error(filename + ': Missing template in YAML front-matter');
        }
        var id = match[1];
        var jsFilename = id + '.js';
        if (!(jsFilename in files)) {
          throw new Error('No .js file found for ' + filename);
        }
        var jsSource = files[jsFilename].contents.toString();
        var requires = getRequires(jsSource);
        file.requires = requires;
        file.js = {
          tag: '<script src="loader.js?id=' + id + '"></script>',
          source: jsSource.replace(cleanupJSRegEx, ''),
          apiHtml: getLinkToApiHtml(requires)
        };
        var cssFilename = id + '.css';
        if (cssFilename in files) {
          file.css = {
            tag: '<link rel="stylesheet" href="' + cssFilename + '">',
            source: files[cssFilename].contents.toString()
          };
        }
        if (file.resources) {
          var resources = [];
          for (var i = 0,
              ii = file.resources.length; i < ii; ++i) {
            var resource = file.resources[i];
            if (isJsRegEx.test(resource)) {
              resources[i] = '<script src="' + resource + '"></script>';
            } else if (isCssRegEx.test(resource)) {
              resources[i] = '<link rel="stylesheet" href="' + resource + '">';
            } else {
              throw new Error('Invalid value for resource: ' + resource + ' is not .js or .css: ' + filename);
            }
          }
          file.extraHead = resources.join('\n');
        }
      }
    }
  }
  function createWordIndex(exampleInfos) {
    var index = {};
    var keys = ['shortdesc', 'title', 'tags', 'requires'];
    exampleInfos.forEach(function(info, i) {
      keys.forEach(function(key) {
        var text = info[key];
        if (Array.isArray(text)) {
          text = text.join(' ');
        }
        var words = text ? text.split(/\W+/) : [];
        words.forEach(function(word) {
          if (word) {
            word = word.toLowerCase();
            var counts = index[word];
            if (counts) {
              if (index in counts) {
                counts[i] += 1;
              } else {
                counts[i] = 1;
              }
            } else {
              counts = {};
              counts[i] = 1;
              index[word] = counts;
            }
          }
        });
      });
    });
    return index;
  }
  function createIndex(files, metalsmith, done) {
    setImmediate(done);
    var exampleInfos = [];
    for (var filename in files) {
      var example = files[filename];
      if (markupRegEx.test(filename)) {
        exampleInfos.push({
          link: filename,
          example: filename,
          title: example.title,
          shortdesc: example.shortdesc,
          tags: example.tags,
          requires: example.requires
        });
      }
    }
    var info = {
      examples: exampleInfos,
      index: createWordIndex(exampleInfos)
    };
    files['index.js'] = {
      contents: new Buffer('var info = ' + JSON.stringify(info)),
      mode: '0644'
    };
  }
  function main(callback) {
    var smith = new Metalsmith('.').source(srcDir).destination(destDir).concurrency(25).metadata({olVersion: pkg.version}).use(augmentExamples).use(createIndex).use(templates({
      engine: 'handlebars',
      directory: templatesDir,
      helpers: {md: function(str) {
          return new handlebars.SafeString(marked(str));
        }}
    })).build(function(err) {
      callback(err);
    });
    return smith;
  }
  if (require.main === module) {
    main(function(err) {
      if (err) {
        process.stderr.write('Building examples failed.  See the full trace below.\n\n' + err.stack + '\n');
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  }
  module.exports = main;
})(require("buffer").Buffer, require("process"));
