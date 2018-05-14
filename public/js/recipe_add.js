function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function(){
	var id = getParameterByName('id');
	if (id) {
        var recipe = null;
        database.ref('Recipes/'+id).once('value').then(function(snapshot) {
            if (snapshot.val()) {
                recipe = snapshot.val();
                $('.breadcrumb-item.active').text('Edit Recipe');
                $('#name_input').val(recipe.recipe_id);
                $('.card-img').attr('src', recipe.src);
                recipe.ingredients = eval(recipe.ingredients);
                $('.ingredient_div input').map(function(idx, obj) {
                    $(obj).val(recipe.ingredients[idx]);
                });
                $('.comment_text').val(recipe.description || '');
            }
        });
    }
    $('#cancel').click(function() {
        location.href = '/recipe';
    });
    $('#submit').click(function() {
        if (!$('.name_div input').val() || !$('.ingredient_div input').val()) {
            $('#errormsg').show();
            setTimeout(function() {
                $('#errormsg').hide();
            }, 2000);
        } else {
            var new_id = id || 'dummyRecipe3';
            var ingredients = [];
            $('.ingredient_div input').map(function(idx, obj) {
                if ($(obj).val()) {
                    ingredients.push($(obj).val());
                }
            });
            database.ref('Recipes/'+new_id).set({
                edit_time: new Date().toISOString(),
                ingredients: JSON.stringify(ingredients), 
                new_review: 0,
                recipe_id: $('#name_input').val(),
                src: $('#restaurant-form-image').src
            }).then(function() {
                location.href = '/recipe';
            });
        }
    });
    $(".save-image").click(function () {
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

$(".ingredient_div button").click(function(){
	$(".ingredient_div button").before(
		'<input type="text">'
	);
});
