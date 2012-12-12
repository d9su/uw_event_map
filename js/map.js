(function($){

	// Model
	var NewEvent = Backbone.Model.extend({
		defaults: {
			event_type: 'info'
		},
	});

	var new_event = new NewEvent();

	// Globals
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
	var pin_anchor = new google.maps.Point(0, 16.5);
	var info_pin = new google.maps.MarkerImage('./img/info_pin.png', pin_size, pin_origin, pin_anchor);
	var game_pin = new google.maps.MarkerImage('./img/game_pin.png', pin_size, pin_origin, pin_anchor);
	var social_pin = new google.maps.MarkerImage('./img/social_pin.png', pin_size, pin_origin, pin_anchor);
	var food_pin = new google.maps.MarkerImage('./img/food_pin.png', pin_size, pin_origin, pin_anchor);
	var workshop_pin = new google.maps.MarkerImage('./img/workshop_pin.png', pin_size, pin_origin, pin_anchor);

	// Create map
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


	function placeEventFlag(location) {
		if (!_place_marker) {
			return;

		} else {
			_place_marker = false;
			var types = ['info', 'game', 'social', 'food', 'workshop'];
			var pins = [info_pin, game_pin, social_pin, food_pin, workshop_pin];
			var img = pins[$.inArray(new_event.get('event_type'), types)];

			var flag = new google.maps.Marker({
				position: location,
				map: _map,
				icon: img,
				animation: google.maps.Animation.DROP
			});
			return; 
		}
	}

	google.maps.event.addDomListener(window, 'load', initialize);


	// Create event
	$('.create_event').click(function(){
		$('.event_form_bubble').show();
	});

	$('.desc_active').live('click', function(){
		$(this).removeClass('desc_active').val('');
	});

	$('.cancel').click(function(){
		$('.event_form_bubble').hide();
		$('.event_form_bubble input[type=text]').val('');
		$('.event_form_bubble textarea').val('');
		$('.event_form_bubble').css('-webkit-transform', 'scale(1.0)');
		return false;
	});

	$('.submit').click(function(){
		$('.event_form_bubble').css('-webkit-transform', 'scale(0.1)');
		$('.event_form').fadeOut(500);
		$('.marker_bg').fadeIn(500);
		$('.event_form_bubble').animate({top: '-300px'}, 500, function(){
			_place_marker = true;
		});
		return false;
	});

	$('.type_reselect').click(function(){
		$('.event_icon_selection').show();
	});

	$('.type_select').click(function(){
		$('.marker_bg').removeClass('bg_'+new_event.get('event_type'));
		new_event.set({event_type: $(this).attr('id')});
		$('.marker_bg').addClass('bg_'+new_event.get('event_type'));
		$('.event_icon_selection').hide();
	});


})(jQuery);