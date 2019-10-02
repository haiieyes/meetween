/* global google */
/* global $ */
/* global axios */
/* global jQuery */
/* global Math */

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
  
  axios.get('data/mrtsg.json')
    .then(function(response){
      
    let arr = response.data;
    
    for (let eachStation = 0; eachStation<= arr.length; eachStation++){
      let myLatlng = new google.maps.LatLng(arr[eachStation].latitude, arr[eachStation].longitude);

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
    
    for (let eachStation = 0; eachStation< arr.length; eachStation++){
          $('#startSelect').append('<option value="' + eachStation+ '">' + arr[eachStation].stationName + '</option>');
          $('#endSelect').append('<option value="' + eachStation + '">' + arr[eachStation].stationName + '</option>');
          
          // console.log(arr[eachStation].stationName);
    }
    
  });

// When MRT is changed, place marker --
// Person A
$("#startSelect").change(function(){
  // clearMarkers();
  
  // Find index
  axios.get('data/mrtsg.json').then(function(response){
    
    let arr = response.data;
    let index = $("#startSelect").val();

    // Create Marker
    let myLatLng = {lat: arr[index].latitude, lng: arr[index].longitude};
    // let myLatlng = new google.maps.LatLng(arr[index].latitude, arr[index].longitude);
    let marker = new google.maps.Marker({
      position: {lat: arr[index].latitude, lng: arr[index].longitude},
      map: map,
      animation: google.maps.Animation.DROP,
    });
    
    // Fly to Marker
    map.panTo(myLatLng);
    map.setZoom(15);
    
    // Create InfoWindow
    let infowindow = new google.maps.InfoWindow({
      content: ('<span jstcache="13">' + arr[index].stationName + '</span>')
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });
  
  // Start if meet requirements
  if ($('#endSelect') != '#'){
    getDirections();
  }
});

// Person B
$("#endSelect").change(function(){
  // clearMarkers();
  
  // Find index
  axios.get('data/mrtsg.json').then(function(response){
    
    let arr = response.data;
    let index = $("#endSelect").val();

    // Create Marker
    let myLatLng = {lat: arr[index].latitude, lng: arr[index].longitude};
    // let myLatlng = new google.maps.LatLng(arr[index].latitude, arr[index].longitude);
    let marker = new google.maps.Marker({
      position: {lat: arr[index].latitude, lng: arr[index].longitude},
      map: map,
    });
    
    // Fly to Marker
    map.panTo(myLatLng);
    map.setZoom(15);
    
    // Create InfoWindow
    let infowindow = new google.maps.InfoWindow({
      content: ('<h1>' + arr[index].stationName + '</h1>')
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });
  
  // Start if meet requirements
  if ($('#startSelect') != '#'){
    getDirections();
  }
});

// Get directions from Person A to Person B --
function getDirections(){
  let startIndex = $("#startSelect").val();
  let endIndex = $("#endSelect").val();
  axios.get('data/mrtsg.json').then(function(response){
    let arr = response.data;
    var origin;
    var destination;
    
    origin = arr[startIndex].latitude + ',' + arr[startIndex].longitude;
    destination = arr[endIndex].latitude + ',' + arr[endIndex].longitude;
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=${apiKey}`;
    // TEST
    doCORSRequest({
        method: this.id === 'post' ? 'POST' : 'GET',
        url: url,
      }, function printResult(result) {
        let responseData = (JSON.parse(result));
        
        // Usage of Response Data --
        let totalStops = 0;
        let waypoints = [];
        
        // Number of lines required to travel
        for (let x = 0 ; x < responseData.routes[0].legs[0].steps.length ; x++){
          if (responseData.routes[0].legs[0].steps[x].travel_mode == "TRANSIT"){
            waypoints.push(responseData.routes[0].legs[0].steps[x]);
          }
        }
        
        // For when there is a need for a line change
        if (waypoints.length > 1){
          
          let lineChangesStations = [];
          for (let eachLineChange = 0; eachLineChange < waypoints.length; eachLineChange++){
            
            // Adding different line changes
            let x = responseData.routes[0].legs[0].steps[eachLineChange].transit_details.line.name;
            lineChangesStations.push(x);

            
            // Add amount of stops to totalStops
            totalStops = totalStops + parseInt(responseData.routes[0].legs[0].steps[eachLineChange].transit_details.num_stops);
          }
          // Find midpoint
          let midpoint = Math.floor(totalStops/2);
          
          // Find midpoint station
          for (let x = 0 ; x < lineChangesStations.length ; x++){
            if (midpoint <= responseData.routes[0].legs[0].steps[x].transit_details.num_stops){
              alert(responseData.routes[0].legs[0].steps[x].transit_details.line.name);
              break
            };
          };  
          alert(midpoint);
        } else {
          
          // For when there is no need for a line change
          totalStops = waypoints[0].transit_details.num_stops;
          // Find midpoint
          let midpoint = Math.floor(totalStops/2);
          alert(midpoint);
          }
          
          
          
        }
        
        
    );
  });
}

// PROXY
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
      printResult(x.responseText);
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
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