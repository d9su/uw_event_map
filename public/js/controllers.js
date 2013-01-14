'use strict';

angular.module('compuzzControllers', []).

	controller('CreateEventController', ['$scope', 'createEventService',
		function($scope, newEvent){
			$scope.newEvent = newEvent;
			$scope.eventDetail = { name: "", desc: "", type: "info", tags: [] };

			$scope.createEvent = function() {
				// Add additional form validation if necessary
				// Add additional data transformation
				newEvent.batchSet($scope.eventDetail);
			}

		}
	]).

	controller('MapController', ['$scope', 'mapService',
		function($scope, map){
			map.initRender(document.getElementById('map_canvas'));
		}
	]);