function UrlParam(url) {

  "use strict";

  var rNull = /^\s*$/,
      rBool = /^(true|false)$/i;

  function conv(val) {
    if (rNull.test(val)) return null;
    if (rBool.test(val)) return val.toLowerCase() === "true";
    if (isFinite(val)) return parseFloat(val);
    if (isFinite(Date.parse(val))) return new Date(val);
    return val;
  }

  if (!url)
    url = window.location.search;

  return url.split("?")[1].split("&")
    .reduce(function(acc, cur) {
      var pair = cur.split("=");
      acc[unescape(pair[0])] = pair.length > 1
        ? conv(unescape(pair[1]))
        : null;
      return acc;
    }, {});
}
