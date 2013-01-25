'use strict';

angular.module('compuzzControllers', []).

	controller('SignupController', ['$scope', '$http', 'queryService',
		function($scope, $http, backend) {
			$scope.errorMsg = '';
			$scope.username = '';
			$scope.password = '';
			$scope.email = '';

			$scope.validateUsername = function() {
				var name = $scope.username;

				// Name cannot be empty
				if (name === '' || name == null)
					return false;
				// Name can only contain valid characters
				if (!name.match('^[0-9a-zA-Z_]+$'))
					return false;
				// Length must be below 16
				if (name.length > 16)
					return false;

				// Name must be syntactically valid up until this point, check for uniqueness
				// Use try/catch to enforace sequential execution
				try {
					$http({
						method: 'GET',
						url: 'user/checkname',
						params: {user_name: name}
					}).success(function(response){
						return response == 'hit' ? true : false;
					});

				} catch(e) {
					console.log(e);
				}
			};

			$scope.validatePassword = function() {
				var password = $scope.password;
				// Length must be between 8 and 16
				if (password.length < 8 || password.length > 16) 
					return false;
				
				return true;
			}

			$scope.validateEmail = function() {
				var email = $scope.email;
				// Must be xxx@yyy.zzz
				if (email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'))
					return true;
				else
					return false;
			}

			$scope.submitCredential = function() {

			};

			$scope.resetState = function() {
				$scope.errorMsg = '';
				$scope.username = '';
				$scope.password = '';
				$scope.email = '';
			};
		}
	]).

	controller('LoginController', ['$scope', 'queryService', 
		function($scope, backend){
			$scope.errorMsg = '';
			$scope.username = '';
			$scope.password = '';

			$scope.submitCredential = function() {
				// var method = angular.lowercase($scope.method.replace(/\s/g, ""));
				var params = {
					username: $scope.username,
					password: $scope.password
				};

				if ($scope.method === 'Sign Up')
					backend.signup.submit(params);
				else if ($scope.method === 'Log In')
					backend.login.submit(params);
			};

			$scope.resetState = function() {
				$scope.errorMsg = '';
				$scope.username = '';
				$scope.password = '';
			};
		}
	]).

	controller('TagListController', ['$scope', 'queryService',
		function($scope, db){
			$scope.tags = db.tag.getTags();
			console.log($scope.tags);
		}
	]).

	controller('NavBarController', ['$scope', 'tagSearchService',
		function($scope, tagSearch){
			$scope.getMatchedTags = function() {
				return tagSearch.getTags();
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
			// map.initRender(document.getElementById('map_canvas'));
		}
	]);