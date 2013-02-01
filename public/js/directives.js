'use strict';

angular.module('compuzzDirectives', []).
	directive('signupForm', function(){
		var linkFn = function(scope, el, attr) {
			scope.$watch('response', function(newVal, oldVal) {
				if (oldVal === newVal) return;

				if (newVal == 'serverfault') {
					scope.errorMsg = 'Server error (it\'s not your fault :P), please try again later.';
				} else if (newVal == 'clientfault') {
					 scope.errorMsg = 'Already logged in! Logout if want to sign up new user.';
				} else if (newVal == 'ok') {
					el.modal('hide');
				} else {
					// Unsupported response code!
					console.log('Unrecognized response: ' + newVal);
				}
			});

			scope.$watch('nameAvailable', function(newVal, oldVal) {
				if (oldVal === newVal) return;

				if (newVal === true) {
					el.find('.name-avail').removeClass('text-error').addClass('text-success').html('User name is available!');
				} else if (newVal === false) {
					el.find('.name-avail').removeClass('text-success').addClass('text-error').html('User name is already taken!');
				}
			});

			scope.$watch('emailAvailable', function(newVal, oldVal) {
				if (oldVal === newVal) return;

				if (newVal === true) {
					el.find('.email-avail').removeClass('text-error').addClass('text-success').html('Email is available!');
				} else if (newVal === false) {
					el.find('.email-avail').removeClass('text-success').addClass('text-error').html('Email is already taken!');
				}
			});

			scope.$watch('username', function(newVal, oldVal) {
				if (oldVal === newVal) return;

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
				if (oldVal === newVal) return;

				var valid = scope.validatePassword();
				if (valid === false) {
					el.find('.password').addClass('error');
					el.find('.psw-strength').removeClass('text-success').addClass('text-error').html('Length too short or too long');

				} else {
					el.find('.password').removeClass('error');
					el.find('.psw-strength').removeClass('text-error').addClass('text-success');
					if (newVal.length < 9)
						el.find('.psw-strength').html('Weak');
					else if (newVal.length < 13)
						el.find('.psw-strength').html('Moderate');
					else if (newVal.length < 17)
						el.find('.psw-strength').html('Strong');
				}

			});

			scope.$watch('email', function(newVal, oldVal){
				if (!newVal) return;

				var valid = scope.validateEmail();
				if (valid === false) {
					el.find('.email').addClass('error');
					// el.find('.email-avail')

				} else {
					el.find('.email').removeClass('error');
				}
			});
		}

		return linkFn;

	}).

	directive('loginForm', function(){
		var linkFn = function(scope, el, attr) {
			scope.$watch('response', function(newVal, oldVal) {
				if (typeof newVal == 'undefined') return;

				if (newVal == 'serverfault') {
					el.find('.text-error').html('Server error (it\'s not your fault :P), please try again later.');
				} else if (newVal == 'clientfault') {
					el.find('.text-error').html('You have already logged in (nice try :P)');
				} else if (newVal == 'ok') {
					el.modal('hide');
				} else {
					// Unsupported response code!
					console.log('Unrecognized response: ' + newVal);
				}
			});
		}

		return linkFn;
	}).

	directive('eventForm', function(){
		var linkFn = function(scope, el, attr) {
			scope.$watch('response', function(newVal, oldVal) {
				if (newVal === oldVal || newVal == null) return;

				if (newVal == 'serverfault') {
					scope.errorMsg = 'Server error (not your fault :P), please try again later.';
				} else if (newVal == 'clientfault') {
					scope.errorMsg = 'You have to be logged in to create events!';
				} else if (newVal == 'ok') {
					el.modal('hide');
					scope.resetState();
				} else {
					// Unsupported response code!
					console.log('Unrecognized response: ' + newVal);
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
				$('#event-form').modal('show');
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

	directive('datePicker', ['$parse', function($parse) {
		var linkFn = function(scope, el, attrs) {
			el.find('.datetimepicker').datetimepicker({
				language: 'en'
			});

			el.on('changeDate', function(e){
				var date = el.find('input').val();
				var model = $parse(attrs.ngModel);
				scope.$apply(function(){
					model.assign(scope, date);
				});
			});

			el.find('.label').on('click', function(){
				el.find('.datetimepicker .add-on:last-child').trigger('click');
			});
		}

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

