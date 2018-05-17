restaurantsRef.once('value').then(function(snapshot) {

	restaurants = snapshot.val();
	var cardTemplate = $('.restaurant-card-template');

	$.each(restaurants, function (index, restaurant) {
		console.log(restaurant);
		var restaurantCard = cardTemplate.clone(true, true).removeAttr('hidden');
		restaurantCard.find('.restaurant-name').html(restaurant.name);
		restaurantCard.find('.restaurant-reg-date').html(restaurant.date);
		restaurantCard.find('.restaurant-address').html(restaurant.address);
		restaurantCard.find('.restaurant-image').attr('src', restaurant.image);
		restaurantCard.find('.restaurant-desc').html(restaurant.description);
		restaurantCard.find('.edit-button').attr('href', 'restaurant?id=' + index);

		restaurantCard.insertBefore($('.restaurant-card-new'));
	})
});
