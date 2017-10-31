ons.ready(function () {

    initTimeline();

    var tabar = document.querySelector('ons-tabbar');
    tabar.addEventListener('postchange', function (event) {
        if (event.index == 0) {
            initTimeline(event);
        }
    });

    $('#takephoto').click(function () {
        console.log("Take a photo");
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });

        function onSuccess(imageURI) {
            console.log(imageURI);
            var image = $("#preview");
            image.attr("src", imageURI);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    });

    var onSuccess = function (position) {
        $("#location").val(position.coords.latitude + "," + position.coords.longitude);
        console.log('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');

        //Initial Map
        var map;
        var div = document.getElementById("map_canvas");
        var map = plugin.google.maps.Map.getMap(div);
        map.one(plugin.google.maps.event.MAP_READY, function () {
            //alert("map_canvas : ready.");           
            map.animateCamera({
                target: {lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 17,
                tilt: 0,
                bearing: 140,
                duration: 5000,
                padding: 0  // default = 20px
              }, function() {
                map.addMarker({
                    'position': {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    }
                });
              });                                       
        });

    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);



});


function initTimeline(event) {

    var url = "http://psupin.azurewebsites.net/pins";
    $.get(url, function (data) {
        $("#timetab").attr("badge", data.length);
        $.each(data, function (index, item) {
            $.get('card.html', function (template) {
                var rendered = Mustache.render(template, item);
                $("#pins").append(rendered);
            });
        });
    });
}