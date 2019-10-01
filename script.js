/* global google */
/* global $ */

var map;
var flightPath;
const apiKey = 'AIzaSyClkwA2bhQgm9NvlqmpOixUuXSQSUQ52uE';

// Simple Map --
let mapOptions = {
  'center': {lat: 1.3521, lng: 103.8198},
  'zoom': 12,
  'disableDefaultUI': true
};

// Adding Test One Marker Function --
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

// PopUp --
function makeInfoWindowEvent(map, infowindow, marker) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker);
  });
}

// Adding a Test Group of Markers Function --
function testGroupMarker() {
  // Test Array of Way Points --
  let markerArr = [
    {
      lat: 1.3521, 
      lng: 103.8198
      
    },
    {
      lat: 1.3621, 
      lng: 103.8298
    },
    {
      lat: 1.3721, 
      lng: 103.8398
    },
  ];

  for (let eachPlace of markerArr){
    // Create Marker
    let marker = new google.maps.Marker({
      position: eachPlace,
      map: map,
      title: ('Test :' + eachPlace) 
    })
    
    // Create InfoWindow
    let infowindow = new google.maps.InfoWindow({
      content: 'Test'
    })
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    
    // Connecting WayPoints Together
    let travelPath = new google.maps.Polyline({
      path: markerArr,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  
  }
  
  
  
  
  
}







$(function(){
    
  // Init Map --
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  
  // Add Layer of Transit
  let transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
  
  // Hide Sidebars --
  $('#personAHideButton').click(function(){
    $('#personA').css("animation-name", "hide");
    $('#showButtonLeft').css("animation-name", "show");
  });
  
  $('#personBHideButton').click(function(){
    $('#personB').css("animation-name", "hide");
    $('#showButtonRight').css("animation-name", "show");
  });
  
  // Show Sidebars --
  $('#showButtonLeft').click(function(){
    $('#personA').css("animation-name", "hideReverse");
    $('#showButtonLeft').css("animation-name", "showReverse");
  });
  
  $('#showButtonRight').click(function(){
    $('#personB').css("animation-name", "hideReverse");
    $('#showButtonRight').css("animation-name", "showReverse");
  });
  
  
  
});