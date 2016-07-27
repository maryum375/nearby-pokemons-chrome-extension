
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('reload-btn').addEventListener('click', getNearbyPokemons);
})
var currentPositionLat;
var currentPositionLon;

function getNearbyPokemons() {
    var xhr = new XMLHttpRequest();

    currentPositionLat = document.getElementById("coords").value.split(',')[0];
    currentPositionLon = document.getElementById("coords").value.split(',')[1];
    xhr.open("GET", "https://pokevision.com/map/data/" + currentPositionLat + "/" + currentPositionLon, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            if (resp.status === "success" && resp.pokemon) {
                var pokemons = resp.pokemon.sort(function (a, b) {
                    var itemADistance = getDistanceFromLatLonInM(currentPositionLat, currentPositionLon, a.latitude, a.longitude);
                    var itemBDistance = getDistanceFromLatLonInM(currentPositionLat, currentPositionLon, b.latitude, b.longitude);
                    return itemADistance - itemBDistance;
                })
                updatePokemonsToView(resp.pokemon);
            }
        }
    }
    xhr.send();

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
    distanceElement.innerText = "distance: " + Math.round(getDistanceFromLatLonInM(currentPositionLat, currentPositionLon, pokemonJsonData.latitude, pokemonJsonData.longitude)) + "m"

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

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}