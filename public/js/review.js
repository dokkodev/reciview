var add_zero = function(num) {
	return num > 9 ? num : '0' + num;
};

var make_date_string = function(date) {
	date = new Date(date);
	return date.getFullYear() + '/' + (add_zero(date.getMonth() + 1)) + '/' + add_zero(date.getDate()) + ' ' +
		add_zero(date.getHours()) + ':' + add_zero(date.getMinutes()) + ':' + add_zero(date.getSeconds());
};

var recipe = {
	recipe_id: 'squidpasta',
	ingredients: ['Tomato', 'Onion', 'Pasta Noodles', 'Garlic']
};
var review_list = {};
var dummy_review_list = [
	{
		recipe_id: 'squidpasta',
		recipe_version: 0,
		star: 4,
		user_profile: '<i class="fa fa-user-circle-o"></i>',
		content: 'Very Gooooooood!\nTomato in soup was very delicious!!',
		comment: ['Thank You Very Much!!'],
		date: new Date('2018-05-03T16:32:17').toISOString(),
		unread: true
	}, {
		recipe_id: 'squidpasta',
		recipe_version: 0,
		star: 2,
		user_profile: '<i class="fa fa-user-circle-o"></i>',
		content: 'Umm.. I hate onion because of its smell not good, but it was not terrible I thought.',
		date: new Date('2018-05-03T16:32:17').toISOString(),
		unread: true
	}, {
		recipe_id: 'squidpasta',
		recipe_version: 0,
		star: 5,
		user_profile: '<i class="fa fa-user-circle-o"></i>',
		content: 'I thought the quality of its pasta Noodles was excellent!',
		date: new Date('2018-05-03T16:32:17').toISOString(),
		unread: false
	}, {
		recipe_id: 'squidpasta',
		recipe_version: 0,
		star: 4,
		user_profile: '<i class="fa fa-user-circle-o"></i>',
		content: 'I love garlic and onion inside this dish :)',
		date: new Date('2018-05-03T16:32:17').toISOString(),
		unread: false
	}
];

var review_card_template = function(review_key) {
	var review = review_list[review_key];
	var stars = '';
	for (var i = 0; i < 5; i++) {
		if (i < review.star) {
			stars += '<i class="fa fa-star"></i>';
		} else {
			stars += '<i class="fa fa-star-o"></i>';
		}
	}
	
	var ingredient_class = '';
	recipe.ingredients.map(function(ingredient) {
		var re = new RegExp(ingredient, 'gi');
		if (re.test(review.content)) {
			review.content = review.content.replace(re, '<span class="filtering">' + ingredient + '</span>');
			ingredient_class += ingredient + ' ';
		}
	});
	return [
		'<div class="card review_card ' + ingredient_class + '" data-key="' + review_key + '">',
			'<div class="card-body row">',
				'<div class="col col-1">',
					'<div class="user_profile">',
						review.user_profile,
					'</div>',
				'</div>',
				'<div class="col col-10">',
					'<div class="review_header">',
						'<span class="star-rating">',
							stars,
						'</span>',
						'<span class="float-right">',
							'<div class="history_detail_wrapper text-right">',
								'<a class="history_detail" href="/recipe_detail/',
									recipe.recipe_id + '/' + review.recipe_version,
								'">show this version of recipe</a>',
							'</div>',
							'<div class="registered_date">',
								'Registered Time : ', make_date_string(review.date),
							'</div>',
						'</span>',
					'</div>',
					'<div class="review_body">',
						'<div class="review_content">',
							review.content,
						'</div>',
						'<div class="review_comment_box">',
							(review.comment && review.comment.length ? review.comment.map(function(comment) {
								return '<div class="review_comment_detail"><i class="fa fa-reply"></i> ' + comment + '<span class="delete_comment">delete</span></div>';
							}).join('<br>') : ''),
						'</div>',
						'<div class="review_comment input-group">',
							'<textarea class="form-control" placeholder="Please comment about this review" rows="1"></textarea>',
							'<div class="input-group-append">',
								'<button class="btn btn-outline-dark save_comment">Enter</button>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="col col-auto">',
					(review.unread ? '<div class="reddot"></div>' : ''),
				'</div>',
			'</div>',
		'</div>'
	].join('');
};

$(document).on('click', '.ingredient', function() {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
	} else {
		$(this).addClass('active');
	}
	if ($('.ingredient.active').length) {
		$('.review_card').hide();
		$('.ingredient.active').map(function(idx, obj) {
			var ingredient = $(obj).text().replace(/ /g, '.');
			$('.review_card.' + ingredient).show();
		});
	} else {
		$('.review_card').show();
	}
});

$(document).on('click', '.filtering', function() {
	var ingredient = $(this).text();
	$('.ingredient').map(function(idx, obj) {
		if ($(obj).text() == ingredient) {
			$(obj).click();
		}
	});
});

$(document).on('click', '.save_comment', function() {
	var $card = $(this).parents('.review_card');
	var comment = $card.find('textarea').val();
	var key = $card.data('key');
	if (review_list[key].comment && review_list[key].comment.length) {
		review_list[key].comment.push(comment);
	} else {
		review_list[key].comment = [comment];
	}
	database.ref('Reviews/'+key).update({comment: review_list[key].comment}).then(function() {
		$('#review_list').empty();
		Object.keys(review_list).map(function(key) {
			$('#review_list').append(review_card_template(key));
		});
	});
});

$(document).on('click', '.delete_comment', function() {
	var $card = $(this).parents('.review_card');
	var key = $card.data('key');
	var idx = $(this).parent().index() / 2;
	review_list[key].comment.splice(idx, 1);
	database.ref('Reviews/'+key).update({comment: review_list[key].comment}).then(function() {
		$('#review_list').empty();
		Object.keys(review_list).map(function(key) {
			$('#review_list').append(review_card_template(key));
		});
	});
});

$(document).on('keypress', '.review_comment textarea', function(evt) {
	var key = evt.keyCode;
	if (key == 13) {
		$(this).parent().find('.save_comment').click();
	}
});

$(document).ready(function() {
	database.ref('Recipes/dummyRecipe').once('value').then(function(snapshot) {
		if (snapshot && snapshot.val()) {
			recipe = snapshot.val();
			if (typeof recipe.ingredients == 'string') {
				recipe.ingredients = eval(recipe.ingredients);
			}
		}
		$('.ingredient-list').append(recipe.ingredients.map(function(ingredient) {
			return '<li class="ingredient">' + ingredient + '</li>';
		}).join(''));
	});
	database.ref('Reviews').once('value').then(function(snapshot) {
		var reviews = snapshot.val();
		Object.keys(reviews).map(function(key) {
			if (reviews[key].recipe_id == recipe.recipe_id) {
				review_list[key] = reviews[key];
			}
		});
		$('#review_list').empty();
		Object.keys(review_list).map(function(key) {
			$('#review_list').append(review_card_template(key));
		});
	});
});