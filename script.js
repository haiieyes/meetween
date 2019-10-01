/* global google */
/* global $ */
/* global axios */
var map;
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
function showAllMRT(){
  
  // Test Array of Way Points --
  axios.get('data/mrtsg.json')
    .then(function(response){
      
    let arr = response.data;
    
    for (let eachStation = 0; eachStation<= arr.length; eachStation++){
      var myLatlng = new google.maps.LatLng(arr[eachStation].latitude, arr[eachStation].longitude);

      // Create Marker
      let marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
      });
      
      // Create InfoWindow
      let infowindow = new google.maps.InfoWindow({
        content: ('<h1>' + arr[eachStation].stationName + '</h1>')
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    }
  });
    
}

// Add MRT Stations to selectors --
axios.get('data/mrtsg.json')
  .then(function(response){

    let arr = response.data;
    
    for (let eachStation = 0; eachStation<= arr.length; eachStation++){
      $('#startSelect').append('<option value="' + arr[eachStation].stationName + '">' + arr[eachStation].stationName + '</option>');
      $('#endSelect').append('<option value="' + arr[eachStation].stationName + '">' + arr[eachStation].stationName + '</option>');
      
      console.log(arr[eachStation].stationName);
    }
    
  });


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