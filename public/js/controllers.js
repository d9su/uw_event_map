'use strict';

angular.module('compuzzControllers', []).

	controller('TagListController', ['$scope', 'dbService',
		function($scope, db){
			$scope.tags = db.tag.getTags();
			console.log($scope.tags);
		}
	]).

	controller('NavBarController', ['$scope', 'tagSearchService', 'logInService',
		function($scope, tagSearch, loginPortal){
			$scope.loginFeedback = {};
			
			$scope.getMatchedTags = function() {
				return tagSearch.getTags();
			};

			$scope.login = function() {
				$scope.loginFeedback = loginPortal.login()
			};
		}
	]).

	controller('CreateEventController', ['$scope', 'createEventService', 'tagSearchService', 
		function($scope, newEvent, tagSearch){
			$scope.sent = false;
			$scope.newEvent = newEvent;
			$scope.errorMsg = "";
			$scope.eventDetail = { name: '', desc: '', type: 'info', tags: [] };
			$scope.remaining = function() {
				var msg = '';
				var remainingChars = 250 - $scope.eventDetail.desc.length;
				if (remainingChars == 1)
					msg = 'character left';
				else
					msg = 'characters left';
				return remainingChars + ' ' + msg;
			};

			$scope.setEventType = function(type) {
				$scope.eventDetail.type = type;
			}

			$scope.createEvent = function() {
				// Add additional form validation if necessary
				if ($scope.eventDetail.name == "" || $scope.eventDetail.desc == "") {
					$scope.errorMsg = "Event name and desciption cannot be empty."
					return;

				} else if ($scope.eventDetail.desc.length > 250) {
					$scope.errorMsg = "Description is too long."
					return;
				}

				// Add additional data transformation
				newEvent.batchSet($scope.eventDetail);
				newEvent.save();
				$scope.resetState();
				$scope.sent = true;
			};

			$scope.didSent = function() {
				if ($scope.sent) {
					$scope.sent = false;
					return true;
				}

				return false;
			};

			$scope.resetState = function() {
				$scope.errorMsg = "";
				$scope.eventDetail = { name: '', desc: '', type: 'info', tags: [] };
			};

			$scope.getMatchedTags = function() {
				return tagSearch.getTags();
			};

		}
	]).

	controller('MapController', ['$scope', 'mapService',
		function($scope, map){
			map.initRender(document.getElementById('map_canvas'));
		}
	]);