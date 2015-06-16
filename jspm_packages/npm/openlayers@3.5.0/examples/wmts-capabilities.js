/* */ 
"format cjs";
goog.require('ol.format.WMTSCapabilities');

var parser = new ol.format.WMTSCapabilities();

$.ajax('data/WMTSCapabilities.xml').then(function(response) {
  var result = parser.read(response);
  $('#log').html(window.JSON.stringify(result, null, 2));
});
