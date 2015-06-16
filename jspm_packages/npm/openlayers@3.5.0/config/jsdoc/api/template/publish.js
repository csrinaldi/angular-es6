/* */ 
(function(process) {
  var template = require("jsdoc/template"),
      fs = require("jsdoc/fs"),
      path = require("jsdoc/path"),
      taffy = require("taffydb").taffy,
      handle = require("jsdoc/util/error").handle,
      helper = require("jsdoc/util/templateHelper"),
      _ = require("underscore"),
      htmlsafe = helper.htmlsafe,
      linkto = helper.linkto,
      resolveAuthorLinks = helper.resolveAuthorLinks,
      scopeToPunc = helper.scopeToPunc,
      hasOwnProp = Object.prototype.hasOwnProperty,
      data,
      view,
      outdir = env.opts.destination;
  function find(spec) {
    return helper.find(data, spec);
  }
  function tutoriallink(tutorial) {
    return helper.toTutorial(tutorial, null, {
      tag: 'em',
      classname: 'disabled',
      prefix: 'Tutorial: '
    });
  }
  function getAncestorLinks(doclet) {
    return helper.getAncestorLinks(data, doclet);
  }
  function hashToLink(doclet, hash) {
    if (!/^(#.+)/.test(hash)) {
      return hash;
    }
    var url = helper.createLink(doclet);
    url = url.replace(/(#.+|$)/, hash);
    return '<a href="' + url + '">' + hash + '</a>';
  }
  function needsSignature(doclet) {
    var needsSig = false;
    if (doclet.kind === 'function' || doclet.kind === 'class') {
      needsSig = true;
    } else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names && doclet.type.names.length) {
      for (var i = 0,
          l = doclet.type.names.length; i < l; i++) {
        if (doclet.type.names[i].toLowerCase() === 'function') {
          needsSig = true;
          break;
        }
      }
    }
    return needsSig;
  }
  function addSignatureParams(f) {
    var params = helper.getSignatureParams(f, 'optional');
    f.signature = (f.signature || '') + '(' + params.join(', ') + ')';
  }
  function addSignatureReturns(f) {
    var returnTypes = helper.getSignatureReturns(f);
    f.signature = '<span class="signature">' + (f.signature || '') + '</span>';
    if (returnTypes.length) {
      f.signature += '<span class="glyphicon glyphicon-circle-arrow-right"></span><span class="type-signature returnType">' + (returnTypes.length ? '{' + returnTypes.join('|') + '}' : '') + '</span>';
    }
  }
  function addSignatureTypes(f) {
    var types = helper.getSignatureTypes(f);
    f.signature = (f.signature || '') + '<span class="type-signature">' + (types.length ? ' :' + types.join('|') : '') + ' </span>';
  }
  function shortenPaths(files, commonPrefix) {
    var regexp = new RegExp('\\\\', 'g');
    Object.keys(files).forEach(function(file) {
      files[file].shortened = files[file].resolved.replace(commonPrefix, '').replace(regexp, '/');
    });
    return files;
  }
  function resolveSourcePath(filepath) {
    return path.resolve(process.cwd(), filepath);
  }
  function getPathFromDoclet(doclet) {
    if (!doclet.meta) {
      return ;
    }
    var filepath = doclet.meta.path && doclet.meta.path !== 'null' ? doclet.meta.path + '/' + doclet.meta.filename.split(/[\/\\]/).pop() : doclet.meta.filename;
    return filepath;
  }
  function generate(title, docs, filename, resolveLinks) {
    resolveLinks = resolveLinks === false ? false : true;
    var docData = {
      filename: filename,
      title: title,
      docs: docs
    };
    var outpath = path.join(outdir, filename),
        html = view.render('container.tmpl', docData);
    if (resolveLinks) {
      html = helper.resolveLinks(html);
    }
    fs.writeFileSync(outpath, html, 'utf8');
  }
  function generateSourceFiles(sourceFiles) {
    Object.keys(sourceFiles).forEach(function(file) {
      var source;
      var sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened);
      helper.registerLink(sourceFiles[file].shortened, sourceOutfile);
      try {
        source = {
          kind: 'source',
          code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, 'utf8'))
        };
      } catch (e) {
        handle(e);
      }
      generate('Source: ' + sourceFiles[file].shortened, [source], sourceOutfile, false);
    });
  }
  function attachModuleSymbols(doclets, modules) {
    var symbols = {};
    doclets.forEach(function(symbol) {
      symbols[symbol.longname] = symbol;
    });
    return modules.map(function(module) {
      if (symbols[module.longname]) {
        module.module = symbols[module.longname];
        module.module.name = module.module.name.replace('module:', 'require("') + '")';
      }
    });
  }
  function buildNav(members) {
    var nav = [];
    var merged = members.namespaces.concat(members.classes);
    merged.sort(function(a, b) {
      if (a.longname > b.longname)
        return 1;
      if (a.longname < b.longname)
        return -1;
      return 0;
    });
    _.each(merged, function(v) {
      if (v.longname.indexOf('olx') !== 0 && v.interface !== true) {
        if (v.kind == 'namespace') {
          nav.push({
            type: 'namespace',
            longname: v.longname,
            name: v.name,
            members: find({
              kind: 'member',
              memberof: v.longname
            }),
            methods: find({
              kind: 'function',
              memberof: v.longname
            }),
            typedefs: find({
              kind: 'typedef',
              memberof: v.longname
            }),
            events: find({
              kind: 'event',
              memberof: v.longname
            })
          });
        }
        if (v.kind == 'class') {
          nav.push({
            type: 'class',
            longname: v.longname,
            name: v.name,
            members: find({
              kind: 'member',
              memberof: v.longname
            }),
            methods: find({
              kind: 'function',
              memberof: v.longname
            }),
            typedefs: find({
              kind: 'typedef',
              memberof: v.longname
            }),
            fires: v.fires,
            events: find({
              kind: 'event',
              memberof: v.longname
            })
          });
        }
      }
    });
    return nav;
  }
  exports.publish = function(taffyData, opts, tutorials) {
    data = taffyData;
    var conf = env.conf.templates || {};
    conf['default'] = conf['default'] || {};
    var templatePath = opts.template;
    view = new template.Template(templatePath + '/tmpl');
    var indexUrl = helper.getUniqueFilename('index');
    var globalUrl = helper.getUniqueFilename('global');
    helper.registerLink('global', globalUrl);
    view.layout = 'layout.tmpl';
    helper.setTutorials(tutorials);
    data = helper.prune(data);
    data.sort('longname, version, since');
    helper.addEventListeners(data);
    var sourceFiles = {};
    var sourceFilePaths = [];
    data().each(function(doclet) {
      doclet.attribs = '';
      if (doclet.examples) {
        doclet.examples = doclet.examples.map(function(example) {
          var caption,
              code;
          if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
            caption = RegExp.$1;
            code = RegExp.$3;
          }
          return {
            caption: caption || '',
            code: code || example
          };
        });
      }
      if (doclet.see) {
        doclet.see.forEach(function(seeItem, i) {
          doclet.see[i] = hashToLink(doclet, seeItem);
        });
      }
      var sourcePath;
      var resolvedSourcePath;
      if (doclet.meta) {
        sourcePath = getPathFromDoclet(doclet);
        resolvedSourcePath = resolveSourcePath(sourcePath);
        sourceFiles[sourcePath] = {
          resolved: resolvedSourcePath,
          shortened: null
        };
        sourceFilePaths.push(resolvedSourcePath);
      }
    });
    var packageInfo = (find({kind: 'package'}) || [])[0];
    if (packageInfo && packageInfo.name) {
      outdir = path.join(outdir, packageInfo.name, packageInfo.version);
    }
    fs.mkPath(outdir);
    var fromDir = path.join(templatePath, 'static');
    var staticFiles = fs.ls(fromDir, 3);
    staticFiles.forEach(function(fileName) {
      var toDir = fs.toDir(fileName.replace(fromDir, outdir));
      fs.mkPath(toDir);
      fs.copyFileSync(fileName, toDir);
    });
    var staticFilePaths;
    var staticFileFilter;
    var staticFileScanner;
    if (conf['default'].staticFiles) {
      staticFilePaths = conf['default'].staticFiles.paths || [];
      staticFileFilter = new (require("jsdoc/src/filter")).Filter(conf['default'].staticFiles);
      staticFileScanner = new (require("jsdoc/src/scanner")).Scanner();
      staticFilePaths.forEach(function(filePath) {
        var extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter);
        extraStaticFiles.forEach(function(fileName) {
          var sourcePath = fs.statSync(filePath).isDirectory() ? filePath : path.dirname(filePath);
          var toDir = fs.toDir(fileName.replace(sourcePath, outdir));
          fs.mkPath(toDir);
          fs.copyFileSync(fileName, toDir);
        });
      });
    }
    if (sourceFilePaths.length) {
      sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
    }
    data().each(function(doclet) {
      var url = helper.createLink(doclet);
      helper.registerLink(doclet.longname, url);
      var docletPath;
      if (doclet.meta) {
        docletPath = getPathFromDoclet(doclet);
        docletPath = sourceFiles[docletPath].shortened;
        if (docletPath) {
          doclet.meta.filename = docletPath;
        }
      }
    });
    data().each(function(doclet) {
      var url = helper.longnameToUrl[doclet.longname];
      if (url.indexOf('#') > -1) {
        doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
      } else {
        doclet.id = doclet.name;
      }
      if (needsSignature(doclet)) {
        addSignatureParams(doclet);
        addSignatureReturns(doclet);
      }
    });
    data().each(function(doclet) {
      doclet.ancestors = getAncestorLinks(doclet);
      if (doclet.kind === 'member') {
        addSignatureTypes(doclet);
      }
      if (doclet.kind === 'constant') {
        addSignatureTypes(doclet);
        doclet.kind = 'member';
      }
    });
    var members = helper.getMembers(data);
    members.tutorials = tutorials.children;
    view.find = find;
    view.linkto = linkto;
    view.resolveAuthorLinks = resolveAuthorLinks;
    view.tutoriallink = tutoriallink;
    view.htmlsafe = htmlsafe;
    view.members = members;
    view.nav = buildNav(members);
    attachModuleSymbols(find({
      kind: ['class', 'function'],
      longname: {left: 'module:'}
    }), members.modules);
    if (conf['default'].outputSourceFiles) {
      generateSourceFiles(sourceFiles);
    }
    if (members.globals.length) {
      generate('Global', [{kind: 'globalobj'}], globalUrl);
    }
    var files = find({kind: 'file'}),
        packages = find({kind: 'package'});
    generate('Index', packages.concat([{
      kind: 'mainpage',
      readme: opts.readme,
      longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page'
    }]).concat(files), indexUrl);
    var classes = taffy(members.classes);
    var modules = taffy(members.modules);
    var namespaces = taffy(members.namespaces);
    var mixins = taffy(members.mixins);
    var externals = taffy(members.externals);
    for (var longname in helper.longnameToUrl) {
      if (hasOwnProp.call(helper.longnameToUrl, longname)) {
        var myClasses = helper.find(classes, {longname: longname});
        if (myClasses.length) {
          generate('Class: ' + myClasses[0].name, myClasses, helper.longnameToUrl[longname]);
        }
        var myModules = helper.find(modules, {longname: longname});
        if (myModules.length) {
          generate('Module: ' + myModules[0].name, myModules, helper.longnameToUrl[longname]);
        }
        var myNamespaces = helper.find(namespaces, {longname: longname});
        if (myNamespaces.length) {
          generate('Namespace: ' + myNamespaces[0].name, myNamespaces, helper.longnameToUrl[longname]);
        }
        var myMixins = helper.find(mixins, {longname: longname});
        if (myMixins.length) {
          generate('Mixin: ' + myMixins[0].name, myMixins, helper.longnameToUrl[longname]);
        }
        var myExternals = helper.find(externals, {longname: longname});
        if (myExternals.length) {
          generate('External: ' + myExternals[0].name, myExternals, helper.longnameToUrl[longname]);
        }
      }
    }
    function generateTutorial(title, tutorial, filename) {
      var tutorialData = {
        title: title,
        header: tutorial.title,
        content: tutorial.parse(),
        children: tutorial.children
      };
      var tutorialPath = path.join(outdir, filename),
          html = view.render('tutorial.tmpl', tutorialData);
      html = helper.resolveLinks(html);
      fs.writeFileSync(tutorialPath, html, 'utf8');
    }
    function saveChildren(node) {
      node.children.forEach(function(child) {
        generateTutorial('Tutorial: ' + child.title, child, helper.tutorialToUrl(child.name));
        saveChildren(child);
      });
    }
    saveChildren(tutorials);
  };
})(require("process"));
