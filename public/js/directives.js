'use strict';

angular.module('compuzzDirectives', []).
	directive('signupForm', function(){
		var linkFn = function(scope, el, attr) {
			scope.$watch('response', function(newVal, oldVal) {
				if (typeof newVal == 'undefined') return;

				if (newVal == 'serverfault') {
					el.find('.text-error').html('Server error (it\'s not your fault :P), please try again later.');
				} else if (newVal == 'clientfault') {
					el.find('.text-error').html('Already logged in! Logout if want to sign up new user.');
				} else if (newVal == 'ok') {
					el.modal('hide');
				} else {
					// Unsupported response code!
					console.log('Unsupported response: ' + newVal);
				}
			});

			scope.$watch('nameAvailable', function(newVal, oldVal) {
				if (typeof newVal == 'undefined') return;

				if (newVal === true) {
					el.find('.name-avail').removeClass('text-error').addClass('text-success').html('User name is available!');
					console.log('valid!');
				} else if (newVal === false) {
					el.find('.name-avail').removeClass('text-success').addClass('text-error').html('User name is already taken!');
				}
			});

			scope.$watch('username', function(newVal, oldVal) {
				if (!newVal) return;

				try {
					var valid = scope.validateUsername();

				} catch (e) {

				}

				if (valid === false) {
					el.find('.username').addClass('error');
					el.find('.name-avail').removeClass('text-success').addClass('text-error').html('User name is invalid');
					scope.nameAvailable = null;

				} else {
					el.find('.username').removeClass('error');
				}
			});

			scope.$watch('password', function(newVal, oldVal) {
				if (!newVal) return;

				var valid = scope.validatePassword();
				if (valid === false) {
					el.find('.password').addClass('error');
					// el.find('.password-desc')

				} else {
					el.find('.password').removeClass('error');
				}

			});

			scope.$watch('email', function(newVal, oldVal){
				if (!newVal) return;

				var valid = scope.validateEmail();
				if (valid === false) {
					el.find('.email').addClass('error');
					// el.find('.email-desc')

				} else {
					el.find('.email').removeClass('error');
				}
			});
		}

		return linkFn;

	}).

	directive('bubbleForm', function(){
		var linkFn = function(scope, el, attr) {
			scope.$watch('didSent()', function(newVal, oldVal) {
				if (newVal === true) {
					el.modal('hide');
				}
			});

			scope.$watch('eventDetail.type', function(newVal, oldVal){
				el.find('.event-type-selection-toggle')
					.removeClass('icon-'+oldVal)
					.addClass('icon-'+newVal);
			});
		};

		return linkFn;
	}).

	directive('navbar', ['queryService', function(backend) {
		var linkFn = function(scope, el, attr) {
			el.find('.create-event').click(function(){
				$('#event-form-bubble').modal('show');
			});

			el.find('.log-in').click(function(){
				$('#login-form').modal('show');
			});

			el.find('.sign-up').click(function(){
				$('#signup-form').modal('show');
			});
		};

		return linkFn;
	}]).

	directive('tagPopOver', function() {
		var popOverTitle = 'Tags';
		var popOverContent = 'span.label.label-info(ng-repeat="tag in getMatchedTags()") {{tag.tag_name}}'

		return {
			
		};

	}).

	directive('tagSearch', ['tagSearchService', function(tagSearch) {
		var linkFn = function(scope, el, attr) {
			el.keyup(function(){
				if (el.val() == '') {
					tagSearch.clearTags();
					scope.$digest(); // Change this to $apply()
				} else {
					tagSearch.searchTag(el.val());
				}
			});
		};

		return linkFn;
	}]);

