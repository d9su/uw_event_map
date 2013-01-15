'use strict';

(function($){

	// ====================
	// View
	// ====================

	// View of new event (event_form)
	var EventForm = {

		updateIcon: function() {
			// change backgound of the form
			this.el.find('.marker_bg').removeClass('bg_'+this.model.previous('event_type'));
			this.el.find('.marker_bg').addClass('bg_'+this.model.get('event_type'));

			// change the event icon
			this.el.find('.event_type').removeClass('icon_'+this.model.previous('event_type'));
			this.el.find('.event_type').addClass('icon_'+this.model.get('event_type'));

			// update text
			// this.el.find('.event_type span').text(this.model.getCurrentEventName());
		},
	};


	// ====================
	// Click Handlers
	// ====================
	$('.create_event').click(function(){
		$('.event_form_bubble').show();
	});

	$('#choose_event_icon').click(function(){
		$('.event_icon_selection').show();
	});


})(jQuery);