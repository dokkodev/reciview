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
                src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_163343927fa%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_163343927fa%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2299.125%22%20y%3D%2296.3%22%3EImage%20cap%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
            }).then(function() {
                location.href = '/recipe';
            });
        }
    });
});

$(".ingredient_div button").click(function(){
	$(".ingredient_div button").before(
		'<input type="text">'
	);
});
