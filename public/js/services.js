'use strict';

angular.module('compuzzServices', ['ngResource']).
	service('dbService', function($resource){
		var tagResources = $resource('/tags', {}, {
			getTags: { method: 'GET', isArray: true },
			// matchTags: { method: 'GET', params: {}, isArray: true }
		});

		var eventResources = $resource('/event', {}, {
			save: { method: 'POST' },
		});

		return {
			tag: tagResources,
			event: eventResources
		}

	}).

	service('createEventService', ['$rootScope', 'dbService', function($rootScope, db){
		var dataOk = false;
		var eventId = -1;
		var eventName = "";
		var eventDesc = "";
		var eventType = "info";
		var eventTags = [];

		var saveEvent = function() {
			console.log('Saving to server...');
			db.event.save({
				id: eventId,
				name: eventName,
				type: eventType,
				desc: eventDesc
			});
			console.log('Saved');
		};

		return {
			getId: function() { return eventId; },
			getName: function() { return eventName; },
			getType: function() { return eventType; },
			getDesc: function() { return eventDesc; },

			setName: function(input) { eventName = input; },
			setType: function(input) { eventType = input; },
			setDesc: function(input) { eventDesc = input; },
			setTags: function(input) { eventTags = input; },
			batchSet: function(event) {
				eventName = event.name;
				eventDesc = event.desc;
				eventType = event.type;
				eventTags = event.tags;
			},

			reset: function() {
				dataOk = false;
				eventId = -1;
				eventName = "";
				eventDesc = "";
				eventType = "info";
			},

			isOk: function() { return dataOk; },
			setOk: function(flag) { 
				dataOk = flag ? true : false; 
				if (dataOk)
					saveEvent();
			}

		}
	}]).

	service('mapService', ['createEventService', function(newEvent){
		// Map Info
		var map;
		var center = new google.maps.LatLng(43.470012, -80.542749);
		var mapBound = new google.maps.LatLngBounds(
			new google.maps.LatLng(43.464569, -80.555878),
			new google.maps.LatLng(43.479993, -80.534935)
			);

		// Customized Marker Images
		var pinSize = new google.maps.Size(26, 33);
		var pinOrigin = new google.maps.Point(0,0);
		var pinAnchor = new google.maps.Point(13, 33);
		var infoPin = new google.maps.MarkerImage('./img/info_pin.png', pinSize, pinOrigin, pinAnchor);
		var gamePin = new google.maps.MarkerImage('./img/game_pin.png', pinSize, pinOrigin, pinAnchor);
		var socialPin = new google.maps.MarkerImage('./img/social_pin.png', pinSize, pinOrigin, pinAnchor);
		var foodPin = new google.maps.MarkerImage('./img/food_pin.png', pinSize, pinOrigin, pinAnchor);
		var workshopPin = new google.maps.MarkerImage('./img/workshop_pin.png', pinSize, pinOrigin, pinAnchor);

		// Map functions
		var checkBounds = function() {
			if(!mapBound.contains(map.getCenter())) {
				var map_center = map.getCenter();
				var x = map_center.lng();
				var y = map_center.lat();

				var max_x = mapBound.getNorthEast().lng();
				var max_y = mapBound.getNorthEast().lat();
				var min_x = mapBound.getSouthWest().lng();
				var min_y = mapBound.getSouthWest().lat();

				if (x < min_x) {x = min_x;}
				if (x > max_x) {x = max_x;}
				if (y < min_y) {y = min_y;}
				if (y > max_y) {y = max_y;}

				map.setCenter(new google.maps.LatLng(y,x));
			}
		};

		var placeEventFlag = function(location) {
			if (!newEvent.isOk()) {
				return;

			} else {
				var types = ['info', 'game', 'social', 'food', 'workshop'];
				var pins = [infoPin, gamePin, socialPin, foodPin, workshopPin];
				var img = pins[$.inArray(newEvent.getType(), types)];
				var id = newEvent.getId() +'';	// make sure id is converted to a string otherwise google's MarkerOptions would complaint
				var flag = new google.maps.Marker({
					title: id,
					position: location,
					map: map,
					icon: img,
					animation: google.maps.Animation.DROP
				});

				var info = 
						'<div class="info_box">\
							<h2>'+newEvent.getName()+'</h2>\
							<p>'+newEvent.getDesc()+'</p>\
						</div>';

				// add listener to display info box
				google.maps.event.addListener(flag, 'click', function() {
					var infoBox = new google.maps.InfoWindow({
						content: info,
						maxWidth: 400
					});
					infoBox.open(map, flag);
				});

				newEvent.reset();
				return; 
			}
		};

		var init = function(wrapper) {
			// set up options
			var mapOptions = {
				zoom: 16,
				center: center,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				maxZoom: 20,
				minZoom: 15,
				streetViewControl: false
			};

			// instantiate map object
			map = new google.maps.Map(wrapper, mapOptions);

			// hooks up various event handlers
			google.maps.event.addListener(map, 'center_changed', checkBounds);
			google.maps.event.addListener(map, 'click', function(event){placeEventFlag(event.latLng)});
		};
	
		return {
			initRender: function(wrapper) {
				google.maps.event.addDomListener(window, 'load', init(wrapper));
			}
		}
	}]);