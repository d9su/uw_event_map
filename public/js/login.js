var hash = document.location.hash.substring(1);
var qs = document.location.search.substring(1);
var data = hash + '&' + qs;	// Join together for easy processing.
var tokens = {};

data.split('&').forEach(function(pair) {
	var segments = pair.split('=', 2).map(decodeURIComponent);
	if(segments[0]) { // Key must be non-empty.
		tokens[segments[0]] = segments[1];
	}
});

$.get('http://localhost:3000/oauth/token', 
	tokens, 
	function(response) {
		
	});

