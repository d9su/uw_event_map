'use strict';

// ====================
// Filters
// ====================
angular.module('mapFilters', []).filter('icon', function(){
	return function(input) {
		var types = ['info', 'game', 'social', 'food', 'workshop'];
		var names = ['Info Session', 'Entertainment', 'Social', 'Refreshment', 'Workshop'];
		if ($.inArray(input, types) == -1)
			return 'Unknown';
		else
			return names[$.inArray(input, types)];
	};
});

/* App Module */
angular.module('compuzz', ['compuzzControllers', 'compuzzServices', 'compuzzDirectives']);

// compuzz.config(['$routeProvider', function($routeProvider) {
//  	$routeProvider.
// 		when('/', {templateUrl: 'partials/phone-list.html', controller: EventController}).
// 		otherwise({redirectTo: '/'});
// }]);
