(function($){

  $.mockjax({
    'url': '/query',
    'urlParams': ['lat', 'lng', 'radius', 'username'],
    'proxy': '/assets/db.json'
  });

  $.mockjax({
    'url': '/assets/templates/free.html',
    'proxy': '/assets/templates/free.html'
  });

})(jQuery);
