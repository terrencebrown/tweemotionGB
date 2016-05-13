
var mymap = L.map('mapid').setView([39, -98], 4);

/* Basemap Layers */
L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
}).addTo(mymap);


var mymarkers = [];

function updateMarkers(newMarker) {
    mymarkers.push(newMarker);
    newMarker.addTo(mymap);

    if (mymarkers.length > 100) {
        oldMarker = mymarkers.shift();
        mymap.removeLayer(oldMarker);
    }
}

// create icons for different sentiments
var image_path = 'http://127.0.0.1:5000/static/assets/img/';


var veryHappyIcon = L.icon({
    iconUrl: image_path + 'very_happy2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [-3, -76]
});
var happyIcon = L.icon({
    iconUrl: image_path + 'happy2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [-3, -76]
});
var neutralIcon = L.icon({
    iconUrl: image_path + 'neutral.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [-3, -76]
});
var sadIcon = L.icon({
    iconUrl: image_path + 'sad2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [-3, -76]
})
var verySadIcon = L.icon({
    iconUrl: image_path + 'very_sad.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [-3, -76]
});


window.addEventListener("load", pageFullyLoaded, false);

function pageFullyLoaded(e) {
    // first create invisible markers so the images are loaded
    L.marker([0, 90], {icon: happyIcon, opacity: 0}).addTo(mymap);
    L.marker([0, 90], {icon: veryHappyIcon, opacity: 0}).addTo(mymap);
    L.marker([0, 90], {icon: neutralIcon, opacity: 0}).addTo(mymap);
    L.marker([0, 90], {icon: sadIcon, opacity: 0}).addTo(mymap);
    L.marker([0, 90], {icon: verySadIcon, opacity: 0}).addTo(mymap);


    // only get tweets if everything else is loaded
    if (!!window.EventSource) {
      var source = new EventSource('http://127.0.0.1:5000/tweets');
      source.onmessage = function(e) {
        var response = JSON.parse(e.data);
        $("#data").text(response.tweet);
        var params = {icon: neutralIcon};
        if (response.sentiment < 2) {
          params = {icon: verySadIcon};
        } else if (response.sentiment < 4) {
          params = {icon: sadIcon};
        } else if (response.sentiment > 7.5) {
          params = {icon: veryHappyIcon};
        } else if (response.sentiment > 6) {
          params = {icon: happyIcon};
        }
        var marker = L.marker([response.coordinates[1],
                               response.coordinates[0]],
                               params);

        updateMarkers(marker);
      }
    }
}
