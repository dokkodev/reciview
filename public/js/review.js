var add_zero = function(num) {
	return num > 9 ? num : '0' + num;
};

var make_date_string = function(date) {
	date = new Date(date);
	return date.getFullYear() + '/' + (add_zero(date.getMonth() + 1)) + '/' + add_zero(date.getDate()) + ' ' +
		add_zero(date.getHours()) + ':' + add_zero(date.getMinutes());
};

var make_review_list = function(review_list, type, order) {
	$('#review_list').empty();
	Object.keys(review_list).sort(function(keyA, keyB) {
		return review_list[keyA][type] < review_list[keyB][type] == order ? -1 : 1;
	}).map(function(key) {
		$('#review_list').append(review_card_template(key));
	});
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var recipe = {
	recipe_id: 'Squid Pasta',
	ingredients: ['Tomato', 'Onion', 'Pasta Noodles', 'Garlic'],
	src: 'imgs/noodles-2733636_1280.jpg'
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
			review.content = review.content.replace(re, '<a class="filtering" tabindex="-1">' + ingredient + '</a>');
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
							// '<div class="history_detail_wrapper text-right">',
							// 	'<a class="history_detail" href="/recipe?id=',
							// 		recipe.recipe_id + '/' + review.recipe_version,
							// 	'">show this version of recipe</a>',
							// '</div>',
							'<div class="registered_date">',
								'등록 날짜 : ', make_date_string(review.date),
							'</div>',
						'</span>',
					'</div>',
					'<div class="review_body">',
						'<div class="review_content">',
							review.content,
						'</div>',
						'<div class="review_comment_box">',
							(review.comment && review.comment.length ? review.comment.map(function(comment) {
								return '<div class="review_comment_detail"><i class="fa fa-reply"></i> ' + comment + '<span class="delete_comment">삭제</span></div>';
							}).join('<br>') : ''),
						'</div>',
						'<div class="review_comment input-group">',
							'<textarea class="form-control" placeholder="Please comment about this review" rows="1"></textarea>',
							'<div class="input-group-append">',
								'<button class="btn btn-outline-dark save_comment">입력</button>',
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
	if (comment && comment.length && comment.trim().length) {
		var key = $card.data('key');
		if (review_list[key].comment && review_list[key].comment.length) {
			review_list[key].comment.push(comment);
		} else {
			review_list[key].comment = [comment];
		}
		review_list[key].unread = false;
		database.ref('Reviews/'+key).update({comment: review_list[key].comment, unread: false}).then(function() {
			make_review_list(review_list, 'date', false);
		});
	}
});

$(document).on('click', '.delete_comment', function() {
	var $card = $(this).parents('.review_card');
	var key = $card.data('key');
	var idx = $(this).parent().index() / 2;
	review_list[key].comment.splice(idx, 1);
	database.ref('Reviews/'+key).update({comment: review_list[key].comment}).then(function() {
		make_review_list(review_list, 'date', false);
	});
});

$(document).on('keypress', '.review_comment textarea', function(evt) {
	var key = evt.keyCode;
	if (key == 13) {
		$(this).parent().find('.save_comment').click();
	}
});

$(document).ready(function() {
	var id = getParameterByName('id');
	database.ref('Recipes/'+id).once('value').then(function(snapshot) {
		if (snapshot && snapshot.val()) {
			recipe = snapshot.val();
			if (typeof recipe.ingredients == 'string') {
				recipe.ingredients = eval(recipe.ingredients);
			}
		}
    $('.breadcrumb-item.active').text(recipe.recipe_id);
		$('.ingredient-list').append(recipe.ingredients.map(function(ingredient) {
			return '<li class="ingredient">' + ingredient + '</li>';
		}).join(''));
		$('.card-img').attr('src', recipe.src);
		$('.description').text(recipe.description || '');
	});
	database.ref('Reviews').once('value').then(function(snapshot) {
		var reviews = snapshot.val();
		Object.keys(reviews).map(function(key) {
			if (reviews[key].recipe_id == recipe.recipe_id) {
				review_list[key] = reviews[key];
			}
		});
		make_review_list(review_list, 'date', false);
	});

	$('#recipe_info i.fa-question-circle').tooltip({
		title: '아래 각 재료들을 클릭하면 해당 재료가 포함된 댓글만 볼 수 있습니다.'
		// title: 'You can filter your reviews by each ingredients just by clicking ingredients below or in reviews.'
	});

	$('.recipe_edit').click(function() {
		location.href = '/recipe_add?id=' + id;
	});

	$('.sort_review').click(function() {
		var type = $(this).data('type');
		var order = $(this).hasClass('asc');
		var $icon = $(this).find('i.fa');
		make_review_list(review_list, type, order);
		if (order) {
			$(this).removeClass('asc').addClass('desc');
			$icon.removeClass('fa-sort-asc').addClass('fa-sort-desc');
		} else {
			$(this).addClass('asc').removeClass('desc');
			$icon.addClass('fa-sort-asc').removeClass('fa-sort-desc');
		}
	});
});
