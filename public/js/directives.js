'use strict';

angular.module('compuzzDirectives', []).

	directive('bubbleForm', ['createEventService', function(eventService){
		var linkFn = function(scope, el, attr) {
			// el.find('.submit').click(function() {
			// 	el.css('-webkit-transform', 'scale(0.1)');
			// 	el.css('-moz-transform', 'scale(0.1)');
			// 	el.css('-o-transform', 'scale(0.1)');
			// 	el.css('-ms-transform', 'scale(0.1)');
			// 	el.find('.event_form').fadeOut(500);
			// 	el.find('.marker_bg').fadeIn(500);
			// 	el.animate({'border-radius': '180px'}, 100);
			// 	el.animate({top: '-300px'}, 500, function(){
			// 		scope.$apply(function(){
			// 			eventService.setReady(true);
			// 		})
			// 	});
			// });

			// scope.service = eventService;

			// scope.$watch('service.isReady()', function(newVal, oldVal) {
			// 	if (newVal === false) {
			// 		el.find('.marker_bg').hide();
			// 		el.find('.event_form').show();
			// 		el.hide();
			// 		el.css('border-radius' , '10px');
			// 		el.css('-webkit-transform', 'scale(1.0)');
			// 		el.css('-moz-transform', 'scale(1.0)');
			// 		el.css('-o-transform', 'scale(1.0)');
			// 		el.css('-ms-transform', 'scale(1.0)');
			// 		el.css('left', '50%');
			// 		el.css('top', '50%');
			// 	}
			// }, true);
		};

		return linkFn;
	}]).

	directive('navbarBtnGroup', function() {
		var linkFn = function(scope, el, attr) {
			el.find('.create-event').click(function(){
				$('#event-form-bubble').modal();
			});
		};

		return linkFn;
	}).

	directive('tagSearch', function() {
		var linkFn = function(scope, el, attr) {
			el.keyup(function(){scope.searchTag();});
		};

		return linkFn;
	});

