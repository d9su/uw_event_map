'use strict';

angular.module('compuzzDirectives', []).

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

	directive('navbarBtnGroup', function() {
		var linkFn = function(scope, el, attr) {
			el.find('.create-event').click(function(){
				$('#event-form-bubble').modal('show');
			});
		};

		return linkFn;
	}).

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

