ons.ready(function () {

    initTimeline();

    var tabar = document.querySelector('ons-tabbar');
    tabar.addEventListener('postchange', function (event) {
        if (event.index == 0) {
            initTimeline(event);
            var login = function() {
                var username = document.getElementById('username').value;
                var password = document.getElementById('password').value;
              
                if (username === 'bob' && password === 'secret') {
                  ons.notification.alert('Congratulations!');
                }
                else {
                  ons.notification.alert('Incorrect username or password.');
                }
              };
        }
    });
    window.fn = {};
    
    window.fn.open = function() {
      var menu = document.getElementById('menu');
      menu.open();
    };
    
    window.fn.load = function(page) {
      var content = document.getElementById('content');
      var menu = document.getElementById('menu');
      content.load(page)
        .then(menu.close.bind(menu));
    };
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

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};


window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
function editSelects(event) {
    document.getElementById('choose-sel').removeAttribute('modifier');
    if (event.target.value == 'material' || event.target.value == 'underbar') {
      document.getElementById('choose-sel').setAttribute('modifier', event.target.value);
    }
  }
  function addOption(event) {
    const option = document.createElement('option');
    let text = document.getElementById('optionLabel').value;
    option.innerText = text;
    text = '';
    document.getElementById('dynamic-sel').appendChild(option);
  }
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