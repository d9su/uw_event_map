'use strict';

angular.module('compuzzControllers', []).

	controller('TagListController', ['$scope', 'dbService',
		function($scope, db){
			$scope.tags = db.tag.getTags();
			console.log($scope.tags);
		}
	]).

	controller('NavBarController', ['$scope', 'dbService',
		function($scope, db){
			$scope.matchString = "";
			$scope.matchedTags = [];
			$scope.timer = 0;
			$scope.searchTag = function(){
				clearTimeout($scope.timer);
				$scope.timer = setTimeout(function(){
					$scope.matchedTags = db.tag.getTags({match: $scope.matchString})
				}, 500);
			};
		}
	]).

	controller('CreateEventController', ['$scope', 'createEventService',
		function($scope, newEvent){
			$scope.newEvent = newEvent;
			$scope.eventDetail = { name: '', desc: '', type: 'info', tags: [] };
			$scope.remaining = function() {
				var msg = '';
				var remainingChars = 250 - $scope.eventDetail.desc.length;
				if (remainingChars == 1)
					msg = 'character left';
				else
					msg = 'characters left';
				return remainingChars + ' ' + msg;
			}

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