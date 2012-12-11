(function($){

	// Globals
	var _map;
	var _uw = new google.maps.LatLng(43.470012, -80.542749);
	var _map_bound = new google.maps.LatLngBounds(
		new google.maps.LatLng(43.464569, -80.555878),
		new google.maps.LatLng(43.479993, -80.534935)
		);
	var _place_marker = false;

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
			var flag = new google.maps.Marker({
				position: location,
				map: _map,
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
		$('.event_form_bubble').animate({top: '-200px'}, 500, function(){
			_place_marker = true;
		});
		return false;
	});

})(jQuery);