/* global google */
/* global $ */
var map;

// Simple Map --
let mapOptions = {
    'center': {lat: 1.3521, lng: 103.8198},
    'zoom': 12,
    'disableDefaultUI': true
};

// Adding a Marker --
function testMarker() {
  let myLatLng = {lat: 1.3187, lng: 103.7064};

  map.panTo(myLatLng);
  map.setZoom(15);

  let marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}

$(function(){
    
  // Init Map --
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  
  // Add Layer of Transit
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  
});