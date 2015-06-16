/* */ 
(function(Buffer) {
  goog.provide('ol.webgl.Context');
  goog.require('goog.array');
  goog.require('goog.asserts');
  goog.require('goog.events');
  goog.require('goog.log');
  goog.require('goog.object');
  goog.require('ol');
  goog.require('ol.webgl.Buffer');
  goog.require('ol.webgl.WebGLContextEventType');
  ol.webgl.BufferCacheEntry;
  ol.webgl.Context = function(canvas, gl) {
    this.canvas_ = canvas;
    this.gl_ = gl;
    this.bufferCache_ = {};
    this.shaderCache_ = {};
    this.programCache_ = {};
    this.currentProgram_ = null;
    this.hitDetectionFramebuffer_ = null;
    this.hitDetectionTexture_ = null;
    this.hitDetectionRenderbuffer_ = null;
    this.hasOESElementIndexUint = goog.array.contains(ol.WEBGL_EXTENSIONS, 'OES_element_index_uint');
    if (this.hasOESElementIndexUint) {
      var ext = gl.getExtension('OES_element_index_uint');
      goog.asserts.assert(!goog.isNull(ext), 'Failed to get extension "OES_element_index_uint"');
    }
    goog.events.listen(this.canvas_, ol.webgl.WebGLContextEventType.LOST, this.handleWebGLContextLost, false, this);
    goog.events.listen(this.canvas_, ol.webgl.WebGLContextEventType.RESTORED, this.handleWebGLContextRestored, false, this);
  };
  ol.webgl.Context.prototype.bindBuffer = function(target, buf) {
    var gl = this.getGL();
    var arr = buf.getArray();
    var bufferKey = goog.getUid(buf);
    if (bufferKey in this.bufferCache_) {
      var bufferCacheEntry = this.bufferCache_[bufferKey];
      gl.bindBuffer(target, bufferCacheEntry.buffer);
    } else {
      var buffer = gl.createBuffer();
      gl.bindBuffer(target, buffer);
      goog.asserts.assert(target == goog.webgl.ARRAY_BUFFER || target == goog.webgl.ELEMENT_ARRAY_BUFFER, 'target is supposed to be an ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER');
      var arrayBuffer;
      if (target == goog.webgl.ARRAY_BUFFER) {
        arrayBuffer = new Float32Array(arr);
      } else if (target == goog.webgl.ELEMENT_ARRAY_BUFFER) {
        arrayBuffer = this.hasOESElementIndexUint ? new Uint32Array(arr) : new Uint16Array(arr);
      } else {
        goog.asserts.fail();
      }
      gl.bufferData(target, arrayBuffer, buf.getUsage());
      this.bufferCache_[bufferKey] = {
        buf: buf,
        buffer: buffer
      };
    }
  };
  ol.webgl.Context.prototype.deleteBuffer = function(buf) {
    var gl = this.getGL();
    var bufferKey = goog.getUid(buf);
    goog.asserts.assert(bufferKey in this.bufferCache_, 'attempted to delete uncached buffer');
    var bufferCacheEntry = this.bufferCache_[bufferKey];
    if (!gl.isContextLost()) {
      gl.deleteBuffer(bufferCacheEntry.buffer);
    }
    delete this.bufferCache_[bufferKey];
  };
  ol.webgl.Context.prototype.disposeInternal = function() {
    var gl = this.getGL();
    if (!gl.isContextLost()) {
      goog.object.forEach(this.bufferCache_, function(bufferCacheEntry) {
        gl.deleteBuffer(bufferCacheEntry.buffer);
      });
      goog.object.forEach(this.programCache_, function(program) {
        gl.deleteProgram(program);
      });
      goog.object.forEach(this.shaderCache_, function(shader) {
        gl.deleteShader(shader);
      });
      gl.deleteFramebuffer(this.hitDetectionFramebuffer_);
      gl.deleteRenderbuffer(this.hitDetectionRenderbuffer_);
      gl.deleteTexture(this.hitDetectionTexture_);
    }
  };
  ol.webgl.Context.prototype.getCanvas = function() {
    return this.canvas_;
  };
  ol.webgl.Context.prototype.getGL = function() {
    return this.gl_;
  };
  ol.webgl.Context.prototype.getHitDetectionFramebuffer = function() {
    if (goog.isNull(this.hitDetectionFramebuffer_)) {
      this.initHitDetectionFramebuffer_();
    }
    return this.hitDetectionFramebuffer_;
  };
  ol.webgl.Context.prototype.getShader = function(shaderObject) {
    var shaderKey = goog.getUid(shaderObject);
    if (shaderKey in this.shaderCache_) {
      return this.shaderCache_[shaderKey];
    } else {
      var gl = this.getGL();
      var shader = gl.createShader(shaderObject.getType());
      gl.shaderSource(shader, shaderObject.getSource());
      gl.compileShader(shader);
      if (goog.DEBUG) {
        if (!gl.getShaderParameter(shader, goog.webgl.COMPILE_STATUS) && !gl.isContextLost()) {
          goog.log.error(this.logger_, gl.getShaderInfoLog(shader));
        }
      }
      goog.asserts.assert(gl.getShaderParameter(shader, goog.webgl.COMPILE_STATUS) || gl.isContextLost(), 'illegal state, shader not compiled or context lost');
      this.shaderCache_[shaderKey] = shader;
      return shader;
    }
  };
  ol.webgl.Context.prototype.getProgram = function(fragmentShaderObject, vertexShaderObject) {
    var programKey = goog.getUid(fragmentShaderObject) + '/' + goog.getUid(vertexShaderObject);
    if (programKey in this.programCache_) {
      return this.programCache_[programKey];
    } else {
      var gl = this.getGL();
      var program = gl.createProgram();
      gl.attachShader(program, this.getShader(fragmentShaderObject));
      gl.attachShader(program, this.getShader(vertexShaderObject));
      gl.linkProgram(program);
      if (goog.DEBUG) {
        if (!gl.getProgramParameter(program, goog.webgl.LINK_STATUS) && !gl.isContextLost()) {
          goog.log.error(this.logger_, gl.getProgramInfoLog(program));
        }
      }
      goog.asserts.assert(gl.getProgramParameter(program, goog.webgl.LINK_STATUS) || gl.isContextLost(), 'illegal state, shader not linked or context lost');
      this.programCache_[programKey] = program;
      return program;
    }
  };
  ol.webgl.Context.prototype.handleWebGLContextLost = function() {
    goog.object.clear(this.bufferCache_);
    goog.object.clear(this.shaderCache_);
    goog.object.clear(this.programCache_);
    this.currentProgram_ = null;
    this.hitDetectionFramebuffer_ = null;
    this.hitDetectionTexture_ = null;
    this.hitDetectionRenderbuffer_ = null;
  };
  ol.webgl.Context.prototype.handleWebGLContextRestored = function() {};
  ol.webgl.Context.prototype.initHitDetectionFramebuffer_ = function() {
    var gl = this.gl_;
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    var texture = ol.webgl.Context.createEmptyTexture(gl, 1, 1);
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1, 1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.hitDetectionFramebuffer_ = framebuffer;
    this.hitDetectionTexture_ = texture;
    this.hitDetectionRenderbuffer_ = renderbuffer;
  };
  ol.webgl.Context.prototype.useProgram = function(program) {
    if (program == this.currentProgram_) {
      return false;
    } else {
      var gl = this.getGL();
      gl.useProgram(program);
      this.currentProgram_ = program;
      return true;
    }
  };
  ol.webgl.Context.prototype.logger_ = goog.log.getLogger('ol.webgl.Context');
  ol.webgl.Context.createTexture_ = function(gl, opt_wrapS, opt_wrapT) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    if (goog.isDef(opt_wrapS)) {
      gl.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_WRAP_S, opt_wrapS);
    }
    if (goog.isDef(opt_wrapT)) {
      gl.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_WRAP_T, opt_wrapT);
    }
    return texture;
  };
  ol.webgl.Context.createEmptyTexture = function(gl, width, height, opt_wrapS, opt_wrapT) {
    var texture = ol.webgl.Context.createTexture_(gl, opt_wrapS, opt_wrapT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return texture;
  };
  ol.webgl.Context.createTexture = function(gl, image, opt_wrapS, opt_wrapT) {
    var texture = ol.webgl.Context.createTexture_(gl, opt_wrapS, opt_wrapT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  };
})(require("buffer").Buffer);
