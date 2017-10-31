var url = "http://172.19.195.163:3000/pins";
document.addEventListener("init", function (event) {
    if (event.target.matches('#post')) {
        console.log("ready");
        
        $.get(url, function (data) {
            var template = $('#template').html();
            var diffDays = 0;
            var countN = 0;
            for (var i = 0; i < data.length; i++) {
                var rendered = Mustache.render(template, data[i]);
                $("#pin").append(rendered);
                var newdata = {};
                newdata.id = data[i].id;
                newdata.title = data[i].title;
                newdata.photo = data[i].photo;
                newdata.lat = data[i].lat;
                newdata.lng = data[i].lng;
                newdata.description = data[i].description;
                newdata.buliding = data[i].buliding;
                newdata.room = data[i].room;
                newdata.day = data[i].day;
                newdata.month = data[i].month;
                newdata.year = data[i].year;
                var oneDay = 24 * 60 * 60 * 1000;
                var today = new Date();
                var firstDate = new Date(data[i].year, data[i].month, data[i].day);
                var secondDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
                diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                if (diffDays === 0) {
                    newdata.timeline = "Today";
                }
                if (diffDays !== 0) {
                    newdata.timeline = diffDays + "D";
                }
                if (data[i].timeline === "Today") {
                    countN++;
                }
                JSON.stringify(newdata);
                var updateUrl = url + "/" + data[i].id;
                $.ajax({
                    url: updateUrl,
                    type: 'PUT',
                    data: newdata,
                    success: function (result) {}
                });
            }
            $("#news").attr("badge", countN);
        });

        
        $('#takephoto').click(function () {
            console.log("Take a photo");
            alert("Take a photo");
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
        $("#addPin").click(function () {
            console.log("add pin clicked");
            var onSuccess = function (position) {
                $("#location").val(position.coords.latitude + "," + position.coords.longitude);
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                console.log(dd);
                var dateP = dd + "/" + mm + "/" + yyyy;
                $.post(url, {
                    photo: "https://vignette3.wikia.nocookie.net/lego/images/a/ac/No-Image-Basic.png",
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: "PSU Phuket",
                    description: $("#desc").val(),
                    buliding: $("#choose-sel").val(),
                    room: $("#room").val(),
                    day: dd,
                    month: mm,
                    year: yyyy,
                    timeline: "Today"
                });
                alert('complete');
                location.reload('post.html')
            };

            function onError(error) {
                console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

        });

    }
});
function deletePin(idT) {
    $.ajax({
        url: url + "/" + idT,
        method: "DELETE",
        success: function (data, status, xhr) {
            location.reload();
        }
    });
}