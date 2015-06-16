/* */ 
(function(process) {
  (function() {
    var f = {
      prefix: "jugl",
      namespaceURI: null,
      loadTemplate: function(h) {
        var i = function(l) {
          var m,
              k,
              n = !l.status || (l.status >= 200 && l.status < 300);
          if (n) {
            try {
              m = l.responseXML;
              k = new e(m.documentElement);
            } catch (j) {
              m = document.createElement("div");
              m.innerHTML = l.responseText;
              k = new e(m.firstChild);
            }
            if (h.callback) {
              h.callback.call(h.scope, k);
            }
          } else {
            if (h.failure) {
              h.failure.call(h.scope, l);
            }
          }
        };
        d(h.url, i);
      }
    };
    var g = function(h, j) {
      h = h || {};
      j = j || {};
      for (var i in j) {
        h[i] = j[i];
      }
      return h;
    };
    var a = function(l, o) {
      var m,
          n,
          k,
          j,
          h;
      if (typeof(l) === "string") {
        m = document.getElementById(l);
        if (!m) {
          throw Error("Element id not found: " + l);
        }
        l = m;
      }
      if (typeof(o) === "string") {
        m = document.getElementById(o);
        if (!m) {
          throw Error("Element id not found: " + o);
        }
        o = m;
      }
      if (o.namespaceURI && o.xml) {
        n = document.createElement("div");
        n.innerHTML = o.xml;
        k = n.childNodes;
        for (j = 0, h = k.length; j < h; ++j) {
          l.appendChild(k[j]);
        }
      } else {
        if (l.ownerDocument && l.ownerDocument.importNode && l.ownerDocument !== o.ownerDocument) {
          o = l.ownerDocument.importNode(o, true);
        }
        l.appendChild(o);
      }
      return o;
    };
    var d = function(h, k, i) {
      var j;
      if (typeof XMLHttpRequest !== "undefined") {
        j = new XMLHttpRequest();
      } else {
        if (typeof ActiveXObject !== "undefined") {
          j = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
          throw new Error("XMLHttpRequest not supported");
        }
      }
      j.open("GET", h);
      j.onreadystatechange = function() {
        if (j.readyState === 4) {
          k.call(i, j);
        }
      };
      j.send(null);
    };
    var b = function(h, i) {
      this.template = h;
      this.node = i;
      this.scope = {};
      this.scope.repeat = {};
    };
    g(b.prototype, {
      clone: function() {
        var i = this.node.cloneNode(true);
        i.removeAttribute("id");
        var h = new b(this.template, i);
        g(h.scope, this.scope);
        return h;
      },
      getAttribute: function(h) {
        var j;
        if (this.node.nodeType === 1) {
          if (this.template.usingNS) {
            j = this.node.getAttributeNodeNS(f.namespaceURI, h);
          } else {
            j = this.node.getAttributeNode(f.prefix + ":" + h);
          }
          if (j && !j.specified) {
            j = false;
          }
        }
        var i;
        if (j) {
          i = new c(this, j, h);
        } else {
          i = j;
        }
        return i;
      },
      setAttribute: function(h, i) {
        this.node.setAttribute(h, i);
      },
      removeAttributeNode: function(h) {
        this.node.removeAttributeNode(h.node);
      },
      getChildNodes: function() {
        var k = this.node.childNodes.length;
        var j = new Array(k);
        var l;
        for (var h = 0; h < k; ++h) {
          l = new b(this.template, this.node.childNodes[h]);
          l.scope = g({}, this.scope);
          j[h] = l;
        }
        return j;
      },
      removeChildNodes: function() {
        while (this.node.hasChildNodes()) {
          this.node.removeChild(this.node.firstChild);
        }
      },
      removeChild: function(h) {
        this.node.removeChild(h.node);
        return node;
      },
      removeSelf: function() {
        this.node.parentNode.removeChild(this.node);
      },
      importNode: function(h) {
        if (this.node.ownerDocument && this.node.ownerDocument.importNode) {
          if (h.node.ownerDocument !== this.node.ownerDocument) {
            h.node = this.node.ownerDocument.importNode(h.node, true);
          }
        }
      },
      appendChild: function(h) {
        this.importNode(h);
        this.node.appendChild(h.node);
      },
      insertAfter: function(h) {
        this.importNode(h);
        var j = this.node.parentNode;
        var i = this.node.nextSibling;
        if (i) {
          j.insertBefore(h.node, i);
        } else {
          j.appendChild(h.node);
        }
      },
      insertBefore: function(h) {
        this.importNode(h);
        var i = this.node.parentNode;
        i.insertBefore(h.node, this.node);
      },
      process: function() {
        var j;
        var r = true;
        var n = ["define", "condition", "repeat"];
        for (var o = 0,
            p = n.length; o < p; ++o) {
          j = this.getAttribute(n[o]);
          if (j) {
            r = j.process();
            if (!r) {
              return ;
            }
          }
        }
        var q = this.getAttribute("content");
        if (q) {
          q.process();
        } else {
          var k = this.getAttribute("replace");
          if (k) {
            k.process();
          }
        }
        var m = this.getAttribute("attributes");
        if (m) {
          m.process();
        }
        if (!q && !k) {
          this.processChildNodes();
        }
        var h = this.getAttribute("omit-tag");
        if (h) {
          h.process();
        }
        var l = this.getAttribute("reflow");
        if (l) {
          l.process();
        }
      },
      processChildNodes: function() {
        var k = this.getChildNodes();
        for (var j = 0,
            h = k.length; j < h; ++j) {
          k[j].process();
        }
      }
    });
    var e = function(h) {
      h = h || {};
      if (typeof h === "string" || (h.nodeType === 1)) {
        h = {node: h};
      }
      if (typeof(h.node) === "string") {
        h.node = document.getElementById(h.node);
        if (!h.node) {
          throw Error("Element id not found: " + h.node);
        }
      }
      if (h.node) {
        this.node = h.node;
        this.loaded = true;
      } else {
        if (h.url) {
          this.load({
            url: h.url,
            callback: h.callback,
            scope: h.scope
          });
        }
      }
    };
    g(e.prototype, {
      node: null,
      usingNS: false,
      xmldom: window.ActiveXObject ? new ActiveXObject("Microsoft.XMLDOM") : null,
      trimSpace: (/^\s*(\w+)\s+(.*?)\s*$/),
      loaded: false,
      loading: false,
      process: function(h) {
        var i,
            j;
        h = g({
          context: null,
          clone: false,
          string: false
        }, h);
        this.usingNS = this.node.getAttributeNodeNS && f.namespaceURI;
        i = new b(this, this.node);
        if (h.clone || h.string) {
          i = i.clone();
        }
        if (h.context) {
          i.scope = h.context;
        }
        i.process();
        if (h.string) {
          if (i.node.innerHTML) {
            j = i.node.innerHTML;
          } else {
            if (this.xmldom) {
              j = i.node.xml;
            } else {
              j = (new XMLSerializer).serializeToString(i.node);
            }
          }
        } else {
          j = i.node;
          if (h.parent) {
            if (h.clone) {
              j = a(h.parent, i.node);
            } else {
              this.appendTo(h.parent);
            }
          }
        }
        return j;
      },
      load: function(j) {
        if (typeof j === "string") {
          j = {url: j};
        }
        j = j || {};
        this.loading = true;
        var h = function(k) {
          this.node = k.node;
          this.loading = false;
          this.loaded = true;
          if (j.callback) {
            j.callback.apply(j.scope, [k]);
          }
        };
        var i;
        if (j.failure) {
          i = (function() {
            return function(k) {
              j.failure.call(j.scope, k);
            };
          })();
        }
        f.loadTemplate({
          url: j.url,
          callback: h,
          failure: i,
          scope: this
        });
      },
      appendTo: function(h) {
        this.node = a(h, this.node);
        return this;
      }
    });
    var c = function(h, j, i) {
      this.element = h;
      this.node = j;
      this.type = i;
      this.nodeValue = j.nodeValue;
      this.nodeName = j.nodeName;
      this.template = h.template;
    };
    g(c.prototype, {
      splitAttributeValue: function(i) {
        i = (i != null) ? i : this.nodeValue;
        var h = this.template.trimSpace.exec(i);
        return h && h.length === 3 && [h[1], h[2]];
      },
      splitExpressionPrefix: function() {
        var h = this.splitAttributeValue();
        if (!h || (h[0] != "structure" && h[0] != "text")) {
          h = [null, this.nodeValue];
        }
        return h;
      },
      getAttributeValues: function() {
        return this.nodeValue.replace(/[\t\n]/g, "").replace(/;\s*$/, "").replace(/;;/g, "\t").split(";").join("\n").replace(/\t/g, ";").split(/\n/g);
      },
      removeSelf: function() {
        this.element.removeAttributeNode(this);
      },
      process: function() {
        return this.processAttribute[this.type].apply(this, []);
      },
      evalInScope: function(k) {
        var i = this.element.scope;
        var h = [];
        var j = [];
        for (key in i) {
          h.push(key);
          j.push(i[key]);
        }
        var l = new Function(h.join(","), "return " + k);
        return l.apply({}, j);
      },
      processAttribute: {
        define: function() {
          var l,
              k,
              j,
              h = this.getAttributeValues();
          for (k = 0, j = h.length; k < j; ++k) {
            l = this.splitAttributeValue(h[k]);
            this.element.scope[l[0]] = this.evalInScope(l[1]);
          }
          this.removeSelf();
          return true;
        },
        condition: function() {
          var h = !!(this.evalInScope(this.nodeValue));
          this.removeSelf();
          if (!h) {
            this.element.removeSelf();
          }
          return h;
        },
        repeat: function() {
          var l = this.splitAttributeValue();
          var r = l[0];
          var o = this.evalInScope(l[1]);
          this.removeSelf();
          if (!(o instanceof Array)) {
            var q = new Array();
            for (var j in o) {
              q.push(j);
            }
            o = q;
          }
          var m;
          var h = this.element;
          for (var n = 0,
              k = o.length; n < k; ++n) {
            m = this.element.clone();
            m.scope[r] = o[n];
            m.scope.repeat[r] = {
              index: n,
              number: n + 1,
              even: !(n % 2),
              odd: !!(n % 2),
              start: (n === 0),
              end: (n === k - 1),
              length: k
            };
            h.insertAfter(m);
            m.process();
            h = m;
          }
          this.element.removeSelf();
          return false;
        },
        content: function() {
          var m = this.splitExpressionPrefix();
          var p = this.evalInScope(m[1]);
          this.removeSelf();
          if (m[0] === "structure") {
            try {
              this.element.node.innerHTML = p;
            } catch (l) {
              var h = document.createElement("div");
              h.innerHTML = p;
              if (this.element.node.xml && this.template.xmldom) {
                while (this.element.node.firstChild) {
                  this.element.node.removeChild(this.element.node.firstChild);
                }
                this.template.xmldom.loadXML(h.outerHTML);
                var k = this.template.xmldom.firstChild.childNodes;
                for (var n = 0,
                    o = k.length; n < o; ++n) {
                  this.element.node.appendChild(k[n]);
                }
              } else {
                this.element.node.innerHTML = h.innerHTML;
              }
            }
          } else {
            var q;
            if (this.element.node.xml && this.template.xmldom) {
              q = this.template.xmldom.createTextNode(p);
            } else {
              q = document.createTextNode(p);
            }
            var j = new b(this.template, q);
            this.element.removeChildNodes();
            this.element.appendChild(j);
          }
          return true;
        },
        replace: function() {
          var k = this.splitExpressionPrefix();
          var j = this.evalInScope(k[1]);
          this.removeSelf();
          if (k[0] === "structure") {
            var m = document.createElement("div");
            m.innerHTML = j;
            if (this.element.node.xml && this.template.xmldom) {
              this.template.xmldom.loadXML(m.outerHTML);
              m = this.template.xmldom.firstChild;
            }
            while (m.firstChild) {
              var l = m.removeChild(m.firstChild);
              if (this.element.node.ownerDocument && this.element.node.ownerDocument.importNode) {
                if (l.ownerDocument != this.element.node.ownerDocument) {
                  l = this.element.node.ownerDocument.importNode(l, true);
                }
              }
              this.element.node.parentNode.insertBefore(l, this.element.node);
            }
          } else {
            var i;
            if (this.element.node.xml && this.template.xmldom) {
              i = this.template.xmldom.createTextNode(j);
            } else {
              i = document.createTextNode(j);
            }
            var h = new b(this.template, i);
            this.element.insertBefore(h);
          }
          this.element.removeSelf();
          return true;
        },
        attributes: function() {
          var h = this.getAttributeValues();
          var n,
              k,
              m;
          for (var l = 0,
              j = h.length; l < j; ++l) {
            n = this.splitAttributeValue(h[l]);
            k = n[0];
            m = this.evalInScope(n[1]);
            if (m !== false) {
              this.element.setAttribute(k, m);
            }
          }
          this.removeSelf();
          return true;
        },
        "omit-tag": function() {
          var l = ((this.nodeValue === "") || !!(this.evalInScope(this.nodeValue)));
          this.removeSelf();
          if (l) {
            var k = this.element.getChildNodes();
            for (var j = 0,
                h = k.length; j < h; ++j) {
              this.element.insertBefore(k[j]);
            }
            this.element.removeSelf();
          }
        },
        reflow: function() {
          var h = ((this.nodeValue === "") || !!(this.evalInScope(this.nodeValue)));
          this.removeSelf();
          if (h) {
            if (this.element.node.outerHTML) {
              this.element.node.outerHTML = this.element.node.outerHTML;
            } else {
              this.element.node.innerHTML = this.element.node.innerHTML;
            }
          }
        }
      }
    });
    window.jugl = g(f, {Template: e});
  })();
})(require("process"));
