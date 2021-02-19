
var baseKml;

// Load base kml
$.ajax({
    url: 'config.kml',
    success: function (kml) { baseKml = kml; },
    async: false
});