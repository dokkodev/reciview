var restaurant = {};
var index = null;

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
var address = null;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17
	});

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    if (marker) marker = null;

    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      let tmpMarker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      });
      markers.push(tmpMarker);
      google.maps.event.addListener(tmpMarker, "click", function(e) {
        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];
        placeMarkerAndPanTo(e.latLng);
        console.log(place.name);
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

	map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng);
  });
}

function placeMarkerAndPanTo(latLng) {

  restaurant.position = JSON.stringify({
    lat: latLng.lat(),
    lng: latLng.lng()
  });

	if (marker) {
		marker.setMap(null);
	}
	marker = new google.maps.Marker({
		position: latLng,
		map: map
	});
	map.panTo(latLng);
	$.get('https://maps.googleapis.com/maps/api/geocode/json?language=en&latlng='+latLng.toUrlValue()+'&key=AIzaSyAzRlXjFCtdnxrrJ5FQKVQGpwcUKp0csGc', function(result) {
		if (result.status == 'OK' && result.results.length) {
      address =
        result.results[0].address_components[1].long_name + ", " +
        result.results[0].address_components[2].long_name + ", " +
        result.results[0].address_components[3].long_name;
      $('#restaurant-form-address').val(address);
      console.log(address);
		}
	});
  map.setZoom(17);
}

function saveRestaurant() {
  restaurant.name = $('#restaurant-form-name').val();
  restaurant.address = $('#restaurant-form-address').val();
  restaurant.type = $('#restaurant-form-type').val();
  restaurant.image = $('#restaurant-form-image').attr('src');
  restaurant.date = "05/13/2018";

  if (index) {
    database.ref('Restaurants/' + index).set(restaurant).then(function() {
      window.location.href = "/";
    });
  } else {
    database.ref('Restaurants').push(restaurant).then(function() {
      window.location.href = "/";
    });
  }
}

$(document).ready(function() {

  let queryId = getParameterByName('id');

	if (queryId != null) {
    console.log(queryId);
    index = queryId;
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
