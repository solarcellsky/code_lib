//fix google map when fancybox reopen
google.maps.event.addListener(map, 'tilesloaded', function() {
	google.maps.event.trigger(map, 'resize');
	map.setCenter(marker.getPosition());
});