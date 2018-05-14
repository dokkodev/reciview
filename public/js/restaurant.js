var restaurant = null;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var marker = null;
var map = null;
var search_box = null;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17
	});
	map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng);
  });
}

function placeMarkerAndPanTo(latLng) {
	if (marker) {
		marker.setMap(null);
	}
	marker = new google.maps.Marker({
		position: latLng,
		map: map
	});
	map.panTo(latLng);
	$.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latLng.toUrlValue()+'&key=AIzaSyAzRlXjFCtdnxrrJ5FQKVQGpwcUKp0csGc', function(result) {
		if (result.status == 'OK' && result.results.length) {
			console.log(result.results[0].formatted_address);
		}
	});
}

$(document).ready(function() {

  let queryId = getParameterByName('id');

	if (queryId != null) {
    console.log(queryId);
    database.ref('Restaurants/' + queryId).once('value').then(function(snapshot) {
      restaurant = snapshot.val();
      if (restaurant != null) {
        console.log(restaurant);
        $('.breadcrumb-second').text('Edit Restaurant');
        $('.image-upload').text('Change Image');

        $('#restaurant-form-name').val(restaurant.name);
        $('#restaurant-form-address').val(restaurant.address);
        $('#restaurant-form-type').val(restaurant.type);
        $('#restaurant-form-image').attr('src', restaurant.image);
        eval('var position = ' + restaurant.position);
        
        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({
            position: position,
            map: map
        });
        map.setCenter(position);
      }
    })
	} else {
        if (navigator.geolocation) { // GPS를 지원하면
            navigator.geolocation.getCurrentPosition(function(position) {
                var curr_position = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (marker) {
                	marker.setMap(null);
                }
                marker = new google.maps.Marker({
                	position: curr_position,
                	map: map
                });
                map.setCenter(curr_position);
            }, function(err) {
              console.log(err);
              var dummy_position = {
                lat: 36.374295,
                lng: 127.365771
              };
              if (marker) marker.setMap(null);
              marker = new google.maps.Marker({
                  position: dummy_position,
                  map: map
              });
              map.setCenter(dummy_position);
            }, {
              enableHighAccuracy: false,
              maximumAge: 0,
              timeout: 5000
            });
        } else {
            console.log('GPS를 지원하지 않습니다');
        }
    }

	$( ".save-image" ).click(function() {
		$('#chooseImageModal').modal('hide');
		var id = document.querySelector('input[name="restaurant-image"]:checked').value;
		switch (id) {
			case '1':
				$('#restaurant-form-image').attr('src', 'imgs/shops-2897328_1280.jpg');
				break;
			case '2':
				$('#restaurant-form-image').attr('src', 'imgs/red-wine-2443699_1280.jpg');
				break;
			case '3':
				$('#restaurant-form-image').attr('src', 'imgs/mallorca-3275998_1280.jpg');
				break;
		}
	});
});
