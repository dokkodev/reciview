$(document).ready(function(){
	console.log($(".name_div input").val());
	console.log($(".ingredient_div input").val());
	if($(".name_div input").val() || $(".ingredient_div input").val()){
		$("#submit").prop('disabled', true);
		console.log(1);
	}
});

$(".ingredient_div button").click(function(){
	$(".ingredient_div button").before(
		'<input type:"text">'
	);
});