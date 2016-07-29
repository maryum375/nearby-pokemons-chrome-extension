function PokemonLocator() {

}

PokemonLocator.getNearbyPokemons = function (lat, lon, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokevision.com/map/data/" + lat + "/" + lon, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            if (resp.status === "success" && resp.pokemon) {
                var pokemons = resp.pokemon.sort(function (a, b) {
                    var itemADistance = GeoCoding.getDistanceFromLatLonInM(lat, lon, a.latitude, a.longitude);
                    var itemBDistance = GeoCoding.getDistanceFromLatLonInM(lat, lon, b.latitude, b.longitude);
                    return itemADistance - itemBDistance;
                })
                callback(resp.pokemon);
            }
        }
    }
    xhr.send();
}