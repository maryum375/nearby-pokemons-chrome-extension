
var addressInputElement;
var currentPositionLat;
var currentPositionLon;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('reload-btn').addEventListener('click', getNearbyPokemons);
    addressInputElement = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(addressInputElement);
})

function getNearbyPokemons() {

    var curreentAddress = addressInputElement.value;
    GeoCoding.getCoordinatesByAddress(curreentAddress, function (coordinates) {
        currentPositionLat = coordinates.lat;
        currentPositionLon = coordinates.lng;
        var nearbyPokemons = PokemonLocator.getNearbyPokemons(currentPositionLat, currentPositionLon, updatePokemonsToView);
    })
}

function updatePokemonsToView(nearbyPokemonsArray) {
    var pokemonsContainer = document.getElementById("nearby-wrapper");
    pokemonsContainer.innerHTML = ""
    for (var i = 0; i < nearbyPokemonsArray.length; i++) {
        var singlePokemonElement = getSinglePokemonView(nearbyPokemonsArray[i])
        pokemonsContainer.appendChild(singlePokemonElement);
    }
}

function getSinglePokemonView(pokemonJsonData) {
    var wrapper = document.createElement("div");
    var pokemonImage = createPokemonImageElement(pokemonJsonData.pokemonId);

    var distanceElement = document.createElement("span")
    var distance = Math.round(GeoCoding.getDistanceFromLatLonInM(currentPositionLat, currentPositionLon, pokemonJsonData.latitude, pokemonJsonData.longitude));
    distanceElement.innerText = "distance: " + distance + "m"

    wrapper.appendChild(pokemonImage);
    wrapper.appendChild(distanceElement);
    return wrapper;
}

function createPokemonImageElement(pokemonId) {
    var pokemonImage = document.createElement("img");
    pokemonImage.src = "/images/main-sprites/red-blue/" + pokemonId + ".png"
    return pokemonImage;
}

// function getLocation(callback) {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(callback);
//     } else {
//         console.log("Geolocation is not supported by this browser.");
//     }
// }