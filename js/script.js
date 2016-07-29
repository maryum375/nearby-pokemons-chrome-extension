
var addressInputElement;
var map;
var currentPositionLat;
var currentPositionLon;
var mapZoom = 18;

var fromProjection;
var toProjection;

var mapMarkerSize;
var mapMarkerOffset;

document.addEventListener('DOMContentLoaded', function () {
    // document.getElementById('reload-btn').addEventListener('click', getNearbyPokemons);
    document.getElementById('go-to-location-btn').addEventListener('click', setLocation);
    addressInputElement = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(addressInputElement);
    initializeMapVariables();
})

function initializeMapVariables() {
    currentPositionLat = 0.0;
    currentPositionLon = 0.0;
    fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(currentPositionLon, currentPositionLat).transform(fromProjection, toProjection);


    mapMarkerSize = new OpenLayers.Size(25, 25);
    mapMarkerOffset = new OpenLayers.Pixel(-(mapMarkerSize.w / 2), -mapMarkerSize.h);

    map = new OpenLayers.Map("Map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    map.setCenter(position, mapZoom);
}

function setLocation() {
    var curreentAddress = addressInputElement.value;
    if (curreentAddress) {
        GeoCoding.getCoordinatesByAddress(curreentAddress, function (coordinates) {
            currentPositionLat = coordinates.lat;
            currentPositionLon = coordinates.lng;
            centerMap();
        });
    } else {
        getLocation(function (location) {
            currentPositionLat = location.coords.latitude;
            currentPositionLon = location.coords.longitude;
            centerMap();
        })
    }
}

function centerMap() {
    var position = new OpenLayers.LonLat(currentPositionLon, currentPositionLat).transform(fromProjection, toProjection);
    map.setCenter(position, mapZoom);
    getNearbyPokemons()
}

function getNearbyPokemons() {
    PokemonLocator.getNearbyPokemons(currentPositionLat, currentPositionLon, updatePokemonsToView);
}

function putSinglePokemonOnMap(pokemonJsonData) {
    var pokemonImage = "/images/main-sprites/red-blue/" + pokemonJsonData.pokemonId + ".png";
    var icon = new OpenLayers.Icon(pokemonImage, mapMarkerSize, mapMarkerOffset);
    var position = new OpenLayers.LonLat(pokemonJsonData.longitude, pokemonJsonData.latitude).transform(fromProjection, toProjection);

    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    markers.addMarker(new OpenLayers.Marker(position, icon));
}


function updatePokemonsToView(nearbyPokemonsArray) {
    for (var i = 0; i < nearbyPokemonsArray.length; i++) {
        putSinglePokemonOnMap(nearbyPokemonsArray[i])
    }
}

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}