/* */ 
"format cjs";
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.TileJSON');



/**
 * Renders a progress bar.
 * @param {Element} el The target element.
 * @constructor
 */
function Progress(el) {
  this.el = el;
  this.loading = 0;
  this.loaded = 0;
}


/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function() {
  if (this.loading === 0) {
    this.show();
  }
  ++this.loading;
  this.update();
};


/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function() {
  setTimeout(function() {
    ++this.loaded;
    this.update();
  }.bind(this), 100);
};


/**
 * Update the progress bar.
 */
Progress.prototype.update = function() {
  var width = (this.loaded / this.loading * 100).toFixed(1) + '%';
  this.el.style.width = width;
  if (this.loading === this.loaded) {
    this.loading = 0;
    this.loaded = 0;
    setTimeout(this.hide.bind(this), 500);
  }
};


/**
 * Show the progress bar.
 */
Progress.prototype.show = function() {
  this.el.style.visibility = 'visible';
};


/**
 * Hide the progress bar.
 */
Progress.prototype.hide = function() {
  if (this.loading === this.loaded) {
    this.el.style.visibility = 'hidden';
    this.el.style.width = 0;
  }
};

var progress = new Progress(document.getElementById('progress'));

var source = new ol.source.TileJSON({
  url: 'http://api.tiles.mapbox.com/v3/mapbox.world-bright.jsonp',
  crossOrigin: 'anonymous'
});

source.on('tileloadstart', function(event) {
  progress.addLoading();
});

source.on('tileloadend', function(event) {
  progress.addLoaded();
});
source.on('tileloaderror', function(event) {
  progress.addLoaded();
});

var map = new ol.Map({
  logo: false,
  layers: [
    new ol.layer.Tile({source: source})
  ],
  renderer: common.getRendererFromQueryString(),
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});
