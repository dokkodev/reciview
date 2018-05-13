$(function() {
	$('#common-navbar').load('templates/common-navbar.html');
});

/****************************************
 * Firebase SETUP
 ****************************************/
var config = {
	apiKey: "AIzaSyAVgdgvjY50s8KJDa8u_q731_3jJPsuI44",
	databaseURL: "https://cs374-2018-on-us-dp.firebaseio.com/",
};

firebase.initializeApp(config);
var database = firebase.database();

var restaurantsRef = database.ref('Restaurants');
