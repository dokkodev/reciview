function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {	
	if (getParameterByName('id') == 1) {
	
		$('.breadcrumb-second a').html('Edit Restaurant');
		$('#restaurant-form-name').val('Burger Queen');
		$('#restaurant-form-address').val('Eueun-Dong, Daejeon');
		$('#restaurant-form-type').val('Italian');
		$('.image-upload').html('Change Image');
		$('#restaurant-form-image').attr('src', 'https://cdn.pixabay.com/photo/2017/10/28/15/30/shops-2897328_1280.jpg');
	}
	
	$( ".save-image" ).click(function() {		
		$('#chooseImageModal').modal('hide');
		var id = document.querySelector('input[name="restaurant-image"]:checked').value;
		switch (id) {
			case '1':
				$('#restaurant-form-image').attr('src', 'https://cdn.pixabay.com/photo/2017/10/28/15/30/shops-2897328_1280.jpg');
				break;
			case '2':
				$('#restaurant-form-image').attr('src', 'https://cdn.pixabay.com/photo/2017/06/26/12/49/red-wine-2443699_1280.jpg');
				break;
			case '3':
				$('#restaurant-form-image').attr('src', 'https://cdn.pixabay.com/photo/2018/03/30/17/58/mallorca-3275998_1280.jpg');
				break;
		}
	});
});