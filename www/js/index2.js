function myMap() {
    var url = "http://172.19.195.163:3000/pins";
    var mapOptions = {
        center: {
            lat: 7.89472,
            lng: 98.35220
        },
        zoom: 16,
    }
    var maps = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    var marker, info;
    $.get(url, function (jsonObj) {
        $.each(jsonObj, function (i, item) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat, item.lng),
                map: maps,
                title: item.room
            });
            info = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    info.setContent(item.room);
                    info.open(maps, marker);
                }
            })(marker, i));
        });
    });
}