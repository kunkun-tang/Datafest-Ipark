(function($, window){

  var MapUrl = 'https://maps.googleapis.com/maps/api/js?';
  var MapParam = {
    'v': '3.exp',
    'signed_in': 'true',
    'callback': 'initmap',
    'key': 'AIzaSyBRn6ciA8c873U6B1Rn7oe3TOjWjHhUCsk'
  };

  var DataUrl = '/query';
  var InitPos = null;

  var map = null;
  var User = 'gongzhitaao';
  var radius = 0;

  var user_marker = null;
  var parkinglot_markers = {};

  var dirdisp = null;
  var dirserv = null;

  window.initmap = function() {

    InitPos = new google.maps.LatLng(32.61, -85.48);

    // create the map
    var mapOptions = {
      center: InitPos,
      zoom: 16
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    create_user_marker();
    update_parkinglot(InitPos);

    google.maps.event.addListener(map, 'click', function(event) {
      user_marker.setPosition(event.latLng);
      update_parkinglot(event.latLng);

      if(dirdisp) dirdisp.set('directions', null);
    });

    // get direction service
    dirserv = new google.maps.DirectionsService();
    dirdisp = new google.maps.DirectionsRenderer();
    dirdisp.setMap(map);
  };                            // function windows.initmap

  function create_user_marker() {
    user_marker = new google.maps.Marker({
      position: InitPos,
      draggable: true,
      map: map
    });

    google.maps.event.addListener(user_marker, 'click', function(event) {
      if (user_marker.infowin) return;

      var param = {
        'url': '/assets/templates/register.html',
        'data': {},
        'height': '340px'
      };
      open_infowin(this, param);
    });

    google.maps.event.addListener(user_marker, 'dragend', function(event) {
      update_parkinglot(event.latLng);

      if(dirdisp) dirdisp.set('directions', null);
    });
  }                             // function create_user_marker

  function update_parkinglot(pos) {
    var data = {
      'lat': pos.lat(),
      'lng': pos.lng(),
      'radius': radius,
      'username': User
    };

    $.ajax({
      url: DataUrl,
      data: data,
      dataType: 'json'
    })
      .success(function(json) {
        var i, data = json;

        for (i = 0; i < data.length; ++i) {
          if (parkinglot_markers[data[i]['id']])
            update_parkinglot_marker(data[i]);
          else create_parkinglot_marker(data[i]);
        }
      });
  }                             // function update_parkinglot

  function create_parkinglot_marker(d) {
    var ratio = parseInt((d['available'] / d['max'] * 100) / 10) * 10;
    var latlng = new google.maps.LatLng(d['coorx'], d['coory']);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: {
        url: 'assets/img/Icon' + ratio +'.svg',
        scaledSize: new google.maps.Size(40, 64) }
    });

    google.maps.event.addListener(marker, 'click', function() {
      var param = {
        'url': d['price'] ? '/assets/templates/nonfree.html' : '/assets/templates/free.html',
        'data': {
          'price': d['price'],
          'name': d['name'],
          'avail': d['available'],
          'total': d['max'] },
        'height': '100px'
      };

      open_infowin(this, param);
      route(marker.position);
    });

    parkinglot_markers[d['id']] = marker;
  }                             // function create_parkinglot_marker

  function update_parkinglot_marker(d) {
    var marker = parkinglot_markers[d['id']];

    var ratio = parseInt((d['available'] / d['max'] * 100) / 10) * 10;
    marker.setIcon({
      url: 'assets/img/Icon' + ratio +'.svg',
      scaledSize: new google.maps.Size(40, 64) });

  }                             // function update_marker

  function open_infowin(marker, kwargs) {
    if (!marker.infowin)
      marker.infowin = new google.maps.InfoWindow();

    google.maps.event.addListener(marker.infowin, 'closeclick', function() {
      marker.infowin = null;
    });

    marker.infowin.setContent(
      '<iframe height="' + kwargs['height'] + '" scrolling="no" frameBorder="0" src="' +
        kwargs.url + '?' + $.param(kwargs.data) + '"></iframe>');

    marker.infowin.open(map, marker);
  }                             // function open_infowin

  function route(to) {
    var request = {
      origin: user_marker.position,
      destination: to,
      travelMode: google.maps.TravelMode.DRIVING
    };

    dirserv.route(request, function(response, status) {
      dirdisp.setDirections(response);
    });
  }                             // function route

  $(document).ready(function(){
    $.getScript('/mock/mock.js')
      .done(function(){
        $('body').append($('<script/>', {
          'src': MapUrl + $.param(MapParam)
        }));
      });
  });                           // entry point

})(jQuery, window);
