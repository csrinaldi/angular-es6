/* */ 
var conf = env.conf.stability;
var defaultLevels = ["deprecated", "experimental", "unstable", "stable", "frozen", "locked"];
var levels = conf.levels || defaultLevels;
var util = require("util");
exports.defineTags = function(dictionary) {
  dictionary.defineTag('api', {
    mustHaveValue: false,
    canHaveType: false,
    canHaveName: false,
    onTagged: function(doclet, tag) {
      var level = tag.text || "experimental";
      if (levels.indexOf(level) >= 0) {
        doclet.stability = level;
      } else {
        var errorText = util.format('Invalid stability level (%s) in %s line %s', tag.text, doclet.meta.filename, doclet.meta.lineno);
        require("jsdoc/util/error").handle(new Error(errorText));
      }
    }
  });
};
function hasApiMembers(doclet) {
  return doclet.longname.split('#')[0] == this.longname;
}
function includeAugments(doclet) {
  var augments = doclet.augments;
  if (augments) {
    var cls;
    for (var i = augments.length - 1; i >= 0; --i) {
      cls = classes[augments[i]];
      if (cls) {
        includeAugments(cls);
        if (cls.fires) {
          if (!doclet.fires) {
            doclet.fires = [];
          }
          cls.fires.forEach(function(f) {
            if (doclet.fires.indexOf(f) == -1) {
              doclet.fires.push(f);
            }
          });
        }
        if (cls.observables) {
          if (!doclet.observables) {
            doclet.observables = [];
          }
          cls.observables.forEach(function(f) {
            if (doclet.observables.indexOf(f) == -1) {
              doclet.observables.push(f);
            }
          });
        }
        if (cls.longname.indexOf('oli.') !== 0) {
          cls._hideConstructor = true;
          delete cls.undocumented;
        }
      }
    }
  }
}
var api = [];
var classes = {};
exports.handlers = {
  newDoclet: function(e) {
    var doclet = e.doclet;
    if (doclet.stability) {
      api.push(doclet);
    }
    if (/.*\.jsdoc$/.test(doclet.meta.filename) && doclet.kind == 'namespace') {
      doclet.namespace_ = true;
    }
    if (doclet.kind == 'class') {
      classes[doclet.longname] = doclet;
    }
  },
  parseComplete: function(e) {
    var doclets = e.doclets;
    for (var i = doclets.length - 1; i >= 0; --i) {
      var doclet = doclets[i];
      if (doclet.stability || doclet.namespace_) {
        if (doclet.kind == 'class') {
          includeAugments(doclet);
        }
        if (doclet.fires) {
          doclet.fires.sort(function(a, b) {
            return a.split(/#?event:/)[1] < b.split(/#?event:/)[1] ? -1 : 1;
          });
        }
        if (doclet.observables) {
          doclet.observables.sort(function(a, b) {
            return a.name < b.name ? -1 : 1;
          });
        }
        continue;
      }
      if (doclet.kind == 'class' && api.some(hasApiMembers, doclet)) {
        doclet._hideConstructor = true;
        includeAugments(doclet);
      } else if (!doclet._hideConstructor) {
        doclet.undocumented = true;
      }
    }
  }
};
