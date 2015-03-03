/*jshint sub:true*/
/*jshint smarttabs:true */

  function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
      // Update the app to reflect a signed in user
      // Hide the sign-in button now that the user is authorized, for example:
      document.getElementById('signinButton').setAttribute('style', 'display: none');
    } else {
      // Update the app to reflect a signed out user
      // Possible error values:
      //   "user_signed_out" - User is signed-out
      //   "access_denied" - User denied access to your app
      //   "immediate_failed" - Could not automatically log in the user
      console.log('Sign-in state: ' + authResult['error']);
    }
  }

(function($, window, aaa){

  var map = aaa;
  var MapUrl = 'https://maps.googleapis.com/maps/api/js?';
  var MapParam = {
    'v': '3.exp',
    'signed_in': 'true',
    'callback': 'initmap',
    'key': 'AIzaSyBRn6ciA8c873U6B1Rn7oe3TOjWjHhUCsk'
  };

  var DatUrl = '/api/findAll?';
  var ReserveUrl = '/api/reserve?';
  var registerURL = '/api/createPark?';
  var User = 'gongzhitaao';

  var initpos = { lat: 32.61, lng: -85.48 };
  var radius = 0;

  var cur_marker = aaa;
  var park_markers = [];

  var directionsDisplay = aaa;
  var directionsService = aaa;

  var reserved = -1;

  window.initmap = function() {

    var mapOptions = {
      center: initpos,
      zoom: 16
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
                              mapOptions);
    directionsService = new google.maps.DirectionsService();
    //directions
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);


    cur_marker = new google.maps.Marker({
      position: new google.maps.LatLng(initpos.lat, initpos.lng),
      draggable: true,
      map: map
    });

    google.maps.event.addListener(map, 'click', function(event) {
      update(event.latLng);
      if(directionsDisplay!=aaa){
        directionsDisplay.set('directions', null);
      }
    });

    var addition = 1;

    google.maps.event.addListener(cur_marker,'dragend',function(event) {
      update(event.latlng,true);
      if(directionsDisplay!=aaa){
        directionsDisplay.set('directions', null);
      }
      cur_marker.info = new google.maps.InfoWindow({
        position: event.latlng,
        maxHeight: 1500
      });


      google.maps.event.addListener(cur_marker, 'click', function() {

		    var cnt = $('<div/>', {'class': 'modal-dialog'}).append(
		      $('<div/>', {'class': 'modal-content'}).append(
		        $('<div/>', {'class': 'modal-header'}).append(
		          $('<h3/>', {'class': 'modal-title', 'text': 'Register a Parkinglot'})
		        ),
		        $('<div/>', {'class': 'modal-body'}).append(
		          $('<form/>', {'class': 'form-horizontal', 'role': 'form'}).append(
		            $('<fieldset/>').append(
		              $('<div/>').append(
		                $('<label/>', {'class': 'col-sm-3 control-label', 'text': 'Name'}),
		                $('<div/>', {'class': 'col-sm-7'}).append(
		                  $('<input/>', {'class': 'form-control', 'id': 'registerName', 'type': 'text'})
		                )
		              ),
		              $('<div/>').append(
		                $('<label/>', {'class': 'col-sm-3 control-label', 'text': 'Available Num'}),
		                $('<div/>', {'class': 'col-sm-7'}).append(
		                  $('<input/>', {'class': 'form-control', 'id': 'registerAvai', 'type': 'text'})
		                )
		              ),
		              $('<div/>').append(
		                $('<label/>', {'class': 'col-sm-3 control-label', 'text': 'Max Num'}),
		                $('<div/>', {'class': 'col-sm-7'}).append(
		                  $('<input/>', {'class': 'form-control', 'id': 'registerMax', 'type': 'text'})
		                )
		              )
		            )
		          )
		        ),

		        $('<div/>', {'class': 'modal-footer'}).append(
		          $('<button/>', {'class': 'btn  btn-primary', 'id': 'createButton' + addition, 'text': 'Create', 'type': 'button'}),
		          $('<button/>', {'class': 'btn', 'id': 'cancelButton', 'text': 'Cancel', 'type': 'button'})        
		        )

		      )
		    ).html();
        
        cur_marker.info.setContent(cnt);
        cur_marker.info.open(map, cur_marker);
        // addition += 1;
				// setTimeout(function () { cur_marker.info.close(); }, 3000);
        
        console.log($('#createButton'+addition));

				$('#createButton'+addition).click(function(){
					console.log("access creat Button");
					$.ajax({
						url: registerURL,
						data: {
							// 'username': 'User',
							'parkName': $('#registerName').val(),
							'parkMax': $('#registerMax').val(),
							'parkAvai': $('#registerAvai').val(),
							'coorx': cur_marker.getPosition().lat(),
							'coory': cur_marker.getPosition().lng()
						},
						dataType: 'json'
					}).success(function(json) {
						console.log(json);
			      add_marker(json);
			      cur_marker.info.close();
			    });
				});

      });

    });

  };

  function calcRoute(endPosition) {

    var request = {
      origin: cur_marker.position,
      destination: endPosition,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      directionsDisplay.setDirections(response);
    });
  }

  function update(loc, drag) {
    if (!drag)
      cur_marker.setPosition(loc);

    var param = {
      'location': loc,
      'radius': radius
    };

    $.ajax({
      url: DatUrl,
      data: {
        'username': User,
        'radius': 10000
      },
      dataType: 'json'
    }).success(function(json) {

      var data = json['0'];

      for (i = 0; i < park_markers.length; ++i)
        remove_marker(park_markers[i]);

      park_markers = [];
      for (i = 0; i < data.length; ++i)
        add_marker(data[i]);
    });
  }

  function add_marker(d) {

    var perc = parseInt((d['available'] / d['max'] * 100) / 10) * 10;
    var latlng = new google.maps.LatLng(d['coorx'], d['coory']);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: {url: '/assets/images/Icon' + perc +'.svg',
      scaledSize: new google.maps.Size(40,64)},
      title: 'Click to zoom'
    });

    park_markers.push(marker);

    var info = new google.maps.InfoWindow({
      position: latlng
    });

    var cnt = $('<div/>').append(
      $('<div/>', {'class': 'popover top'}),
      $('<div/>', {'class': 'arrow'}),
      $('<h3/>', {'class': 'popover-title', 'text': d['name']}),
      $('<div/>'), {'class': 'popover-content'},
      $('<p/>', {'text': 'price: ' + d['price']}),
      $('<div/>', {'class': 'progress'}).append(
        $('<div/>', {
          'id': 'prog' + d['_id'],
          'class': 'progress-bar progress-bar-striped', 'role': 'progressbar',
          'aria-valuenow': '0', 'aria-valuemin': '0',
          'aria-valuemax': '100', 'style': 'width:' + d['available']/d['max'] * 100 + '%',
          'text': '' + d['available'] + '/' + d['max']})),
      $('<button/>', {
        'id': 'park' + d['_id'],
        'type': 'button',
        'class': 'btn btn-default reserve-btn',
        'text': 'Reserve' })
    ).html();

    // if (d['reserved'])
    //   reserved = d['_id'];

    google.maps.event.addListener(marker, 'click', function() {
      info.setContent(cnt);
      info.open(map, marker);
      calcRoute(marker.position);

      $('#park' + d['_id']).click(function(){
        if (reserved == parseInt(d['_id'])) {
          $.ajax({
            url: ReserveUrl,
            data: {'parkID': -parseInt(d['_id']), 'username': User},
            dataType: 'json'
          })
            .success(function(d) {
              var data = d['0']['0'];
              swal("Cancelled!", "Your reservation has been cancelled.", "success");
              $('#park' + data['_id']).text('Reserve');
              $('#prog' + data['_id']).text('' + (data['available'] - 1) + '/' + data['max']);
              reserved = -1;
            });
        } else {
          $.ajax({
            url: ReserveUrl,
            data: {'parkID': parseInt(d['_id']), 'username': User},
            dataType: 'json'
          })
            .success(function(d) {
              var data = d['0']['0'];
              swal("Reserved!", "Your reservation has been confirmed.", "success");
              console.log(data['_id']);
              $('#park' + data['_id']).text('Cancel');
              reserved = parseInt(data['_id']);
              $('#prog' + data['_id']).text('' + (data['available'] - 1) + '/' + data['max']);
            });
        }
      });
    });
  }

  function remove_marker(mk) {
    mk.setMap(null);
    mk = null;
  }

  $(document).ready(function() {

    var $script = $('<script/>', {
      'type':  'text/javascript',
      'src': MapUrl + $.param(MapParam)
    });

    $('body').append($script);

  });

})(jQuery, window);
