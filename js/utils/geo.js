function GeoCoding() {
}

GeoCoding.getCoordinatesByAddress = function (address, callback) {
    address = encodeURIComponent(address)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://maps.google.com/maps/api/geocode/json?address=" + address);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            if (resp.results && resp.results.length) {
                var coordinates = GeoCoding._getCoordinatesFromGeoConeServiceResponse(resp.results);
                callback(coordinates)
            }
        }
    }
    xhr.send();
}


GeoCoding.getDistanceFromLatLonInM = function (lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = GeoCoding.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = GeoCoding.deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(GeoCoding.deg2rad(lat1)) * Math.cos(GeoCoding.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
}

GeoCoding.deg2rad = function (deg) {
    return deg * (Math.PI / 180)
}

GeoCoding._getCoordinatesFromGeoConeServiceResponse = function (responseJson) {

    if (responseJson[0].geometry) {
        if (responseJson[0].geometry.location) {
            return responseJson[0].geometry.location
        }
    }
}