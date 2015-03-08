(function($){

  $.mockjax({
    'url': '/query',
    'urlParams': ['lat', 'lng', 'radius', 'username'],
    'proxy': '/mock/db.json'
  });

  $.mockjax({
    'url': '/template/free.html',
    'proxy': '/template/free.html'
  });

})(jQuery);
