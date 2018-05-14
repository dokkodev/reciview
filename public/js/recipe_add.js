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
            
        }
    });
});

$(".ingredient_div button").click(function(){
	$(".ingredient_div button").before(
		'<input type="text">'
	);
});
