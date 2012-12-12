(function($){

	// ====================
	// Model
	// ====================

	// Model of the newly created event
	var Event = Backbone.Model.extend({
		defaults: {
			id: 			null,
			event_type: 	'info',
			event_id: 		0,
			event_name: 	'',
			event_desc: 	'',
			event_tag: 		[],
		},

		resetContent: function() {
			this.set(this.defaults);
		},

		getEventNameByType: function(type) {
			var types = ['info', 'game', 'social', 'food', 'workshop'];
			var names = ['Info Session', 'Entertainment', 'Social', 'Refreshment', 'Workshop'];
			if ($.inArray(type, types) == -1)
				return 'Unknown';
			else
				return names[$.inArray(type, types)];
		},

		getCurrentEventName: function() {
			return this.getEventNameByType(this.get('event_type'));
		}

	});

	// Instantiation
	var _event = new Event();


	// ====================
	// View
	// ====================

	// View of new event (event_form)
	var EventForm = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this, 'updateIcon', 'resetForm');
			this.el = $('.event_form_bubble');
			this.model = _event;
			this.model.bind('change:event_type', this.updateIcon, this);
			this.model.bind('change:id', this.resetForm, this);
		},

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

		resetForm: function() {
			if (this.model.get('id') != null)
				return;

			this.el.find('.marker_bg').hide();
			this.el.find('.event_form').show();
			this.el.hide();
			this.el.css('border-radius' , '10px');
			this.el.css('-webkit-transform', 'scale(1.0)');
			this.el.css('-moz-transform', 'scale(1.0)');
			this.el.css('-o-transform', 'scale(1.0)');
			this.el.css('-ms-transform', 'scale(1.0)');
			this.el.css('left', '50%');
			this.el.css('top', '50%');
		}

	});
	
	// Instantiation
	var _event_form = new EventForm();


	// ====================
	// Globals for google map
	// ====================
	var _map;
	var _uw = new google.maps.LatLng(43.470012, -80.542749);
	var _map_bound = new google.maps.LatLngBounds(
		new google.maps.LatLng(43.464569, -80.555878),
		new google.maps.LatLng(43.479993, -80.534935)
		);
	var _place_marker = false;

	// Customized Marker Images
	var pin_size = new google.maps.Size(26, 33);
	var pin_origin = new google.maps.Point(0,0);
	var pin_anchor = new google.maps.Point(13, 33);
	var info_pin = new google.maps.MarkerImage('./img/info_pin.png', pin_size, pin_origin, pin_anchor);
	var game_pin = new google.maps.MarkerImage('./img/game_pin.png', pin_size, pin_origin, pin_anchor);
	var social_pin = new google.maps.MarkerImage('./img/social_pin.png', pin_size, pin_origin, pin_anchor);
	var food_pin = new google.maps.MarkerImage('./img/food_pin.png', pin_size, pin_origin, pin_anchor);
	var workshop_pin = new google.maps.MarkerImage('./img/workshop_pin.png', pin_size, pin_origin, pin_anchor);


	// ====================
	// Map
	// ====================

	// Render map
	function initialize() {
		// set up options
		var map_options = {
			zoom: 16,
			center: _uw,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			maxZoom: 20,
			minZoom: 15,
			streetViewControl: false
		};

		// instantiate map object
		_map = new google.maps.Map(document.getElementById('map_canvas'), map_options);

		// hooks up various event handlers
		google.maps.event.addListener(_map, 'center_changed', checkBounds);
		google.maps.event.addListener(_map, 'click', function(event){placeEventFlag(event.latLng)});
	}

	// Restrict bounds
	function checkBounds() {    
	    if(! _map_bound.contains(_map.getCenter())) {
	      var map_center = _map.getCenter();
	      var x = map_center.lng();
	      var y = map_center.lat();

	      var max_x = _map_bound.getNorthEast().lng();
	      var max_y = _map_bound.getNorthEast().lat();
	      var min_x = _map_bound.getSouthWest().lng();
	      var min_y = _map_bound.getSouthWest().lat();

	      if (x < min_x) {x = min_x;}
	      if (x > max_x) {x = max_x;}
	      if (y < min_y) {y = min_y;}
	      if (y > max_y) {y = max_y;}

	      _map.setCenter(new google.maps.LatLng(y,x));
	    }
	}

	// Drop a pin at specified location
	function placeEventFlag(location) {
		if (!_place_marker) {
			return;

		} else {
			_place_marker = false;
			var types = ['info', 'game', 'social', 'food', 'workshop'];
			var pins = [info_pin, game_pin, social_pin, food_pin, workshop_pin];
			var img = pins[$.inArray(_event.get('event_type'), types)];
			var id = _event.get('event_id')+'';	// make sure id is converted to a string otherwise google's MarkerOptions would complaint
			var flag = new google.maps.Marker({
				title: id,
				position: location,
				map: _map,
				icon: img,
				animation: google.maps.Animation.DROP
			});

			var info = 
					'<div class="info_box">\
						<h2>'+_event.get('event_name')+'</h2>\
						<p>'+_event.get('event_desc')+'</p>\
					</div>';

			// add listener to display info box
			google.maps.event.addListener(flag, 'click', function() {
				var info_box = new google.maps.InfoWindow({
					content: info,
					maxWidth: 400
				});
				info_box.open(_map, flag);
			});

			// Reset the event model once everything is done
			_event.resetContent();
			return; 
		}
	}

	// Load the map once the page is loaded
	google.maps.event.addDomListener(window, 'load', initialize);


	// ====================
	// Click Handlers
	// ====================
	$('.create_event').click(function(){
		$('.event_form_bubble').show();
	});

	$('.cancel').click(function(){
		$('.event_form_bubble').hide();
		$('.event_form_bubble input[type=text]').val('');
		$('.event_form_bubble textarea').val('');
		return false;
	});

	$('.submit').click(function(){
		// Save info into model
		var event_name = $('.event_form input[name=event_name]').val();
		var event_desc = $('.event_form textarea[name=event_desc]').val();
		_event.set({
			id: 1,
			event_name: event_name,
			event_desc: event_desc
		});

		// Shrink the bubble and fade out form/fade in background icon
		$('.event_form_bubble').css('-webkit-transform', 'scale(0.1)');
		$('.event_form_bubble').css('-moz-transform', 'scale(0.1)');
		$('.event_form_bubble').css('-o-transform', 'scale(0.1)');
		$('.event_form_bubble').css('-ms-transform', 'scale(0.1)');
		$('.event_form').fadeOut(500);
		$('.marker_bg').fadeIn(500);
		$('.event_form_bubble').animate({'border-radius': '180px'}, 100);
		$('.event_form_bubble').animate({top: '-300px'}, 500, function(){
			_place_marker = true;
		});

		return false;
	});

	$('#choose_event_icon').click(function(){
		$('.event_icon_selection').show();
	});

	$('.type_select').click(function(){
		_event.set({event_type: $(this).attr('id')});
		$('.event_icon_selection').hide();
	});


})(jQuery);