/* */ 
(function(Buffer) {
  goog.provide('ol.Size');
  goog.provide('ol.size');
  goog.require('goog.asserts');
  ol.Size;
  ol.size.buffer = function(size, buffer, opt_size) {
    if (!goog.isDef(opt_size)) {
      opt_size = [0, 0];
    }
    opt_size[0] = size[0] + 2 * buffer;
    opt_size[1] = size[1] + 2 * buffer;
    return opt_size;
  };
  ol.size.equals = function(a, b) {
    return a[0] == b[0] && a[1] == b[1];
  };
  ol.size.hasArea = function(size) {
    return size[0] > 0 && size[1] > 0;
  };
  ol.size.scale = function(size, ratio, opt_size) {
    if (!goog.isDef(opt_size)) {
      opt_size = [0, 0];
    }
    opt_size[0] = (size[0] * ratio + 0.5) | 0;
    opt_size[1] = (size[1] * ratio + 0.5) | 0;
    return opt_size;
  };
  ol.size.toSize = function(size, opt_size) {
    if (goog.isArray(size)) {
      return size;
    } else {
      goog.asserts.assert(goog.isNumber(size));
      if (!goog.isDef(opt_size)) {
        opt_size = [size, size];
      } else {
        opt_size[0] = size;
        opt_size[1] = size;
      }
      return opt_size;
    }
  };
})(require("buffer").Buffer);
