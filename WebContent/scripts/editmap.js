var data = null; 
var row_no = 0;
var map = null;
var mgr = null;
var markers = [];
var geocoder = null;
var cLat = null;
var cLng = null;
google.load('visualization', '1', {'packages': ['table']});
google.setOnLoadCallback(initialize);


function initialize() {
	setupTable();
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map_canvas"));
		map.enableGoogleBar();
		var tileLayersNormal = G_MAPMAKER_NORMAL_MAP.getTileLayers();
		var mapMakerNormal = new GMapType(tileLayersNormal, G_MAPMAKER_NORMAL_MAP.getProjection(), 'MapMaker Normal',{errorMessage:"Out of bounds"});
		map.addMapType(mapMakerNormal);
		var tileLayersHybrid = G_MAPMAKER_HYBRID_MAP.getTileLayers();     
		var mapMakerHybrid = new GMapType(tileLayersHybrid, G_MAPMAKER_HYBRID_MAP.getProjection(), 'MapMaker Hybrid',{errorMessage:"Out of bounds"});
		map.addMapType(mapMakerHybrid);
		var mapControl = new GMapTypeControl();
		map.setCenter(new GLatLng(-3.7325370241018394, -38.51085662841797), 12);
		map.addControl(new GSmallMapControl());
		map.addControl(new GMapTypeControl());

		/* first set of options is for the visual overlay.*/
		var boxStyleOpts = {
				opacity: .2,
				border: "2px solid red"
		}

		/* second set of options is for everything else */
		var otherOpts = {
			buttonHTML: "<img src='images/zoom-button.gif' />",
			buttonZoomingHTML: "<img src='images/zoom-button-activated.gif' />",
			buttonStartingStyle: {width: '24px', height: '24px'}
		};

		map.addControl(new DragZoomControl({}, {backButtonEnabled: true}, {}));
		geocoder = new GClientGeocoder();

		GEvent.addListener(map, 'click', function(overlay, latlng) {       
			var lat = latlng.lat();
			var lon = latlng.lng();
			cLat = lat;
			cLng = lon;
			var latOffset = 0.01;
			var lonOffset = 0.01;
			var point = new GLatLng(lat, lon); 
			marker = new GMarker(point);
			markers.push(marker);
			map.addOverlay(new GMarker(point));
			geocoder.getLocations(latlng, showAddress);
		});
	}
	adjustPageHeight();
}  

function adjustPageHeight() {
	var height = document.body.scrollHeight;
	document.getElementById("map_canvas").style.height = 
		height - 130;
}

function clearMarkers() {
	map.clearOverlays();
}

function reloadMarkers() {
	clearMarkers();
	for(var i= 0; i <  markers.length ; i++) {
		map.addOverlay(markers[i]);
	}
}

function reset() {
	markers = [];
	clearMarkers();
	data.removeRows(0,row_no);
	row_no = 0;
	visualization.draw(data, null);
	map.setCenter(new GLatLng(-3.7325370241018394, -38.51085662841797), 12);
}

function showAddress(response) {
	if (!response || response.Status.code != 200) {
		alert("Status Code:" + response.Status.code);
	} else {
		place = response.Placemark[0];
		point = new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]); 
		data.addRows(1);
		data.setCell(row_no,0,row_no + 1);
		data.setCell(row_no,1,place.address);
		data.setCell(row_no,2, cLat);
		data.setCell(row_no,3, cLng);
		++row_no;

		visualization = new google.visualization.Table(document.getElementById('table_canvas'));
		visualization.draw(data, null);
		google.visualization.events.addListener(visualization, 'select', selectHandler);

		var marker = markers[row_no -1];
		marker.openInfoWindowHtml(
				'<b>orig latlng:</b>' + response.name + '<br/>' + 
				'<b>Reverse Geocoded latlng:</b>' + place.Point.coordinates[1] + "," + place.Point.coordinates[0] + '<br>' +
				'<b>Status Code:</b>' + response.Status.code + '<br>' +
				'<b>Status Request:</b>' + response.Status.request + '<br>' +
				'<b>Address:</b>' + place.address + '<br>' +
				'<b>Accuracy:</b>' + place.AddressDetails.Accuracy + '<br>' +
				'<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);
	}

}

function setupTable() {
	data = new google.visualization.DataTable();
	data.addColumn('number', 'Sl. No');
	data.addColumn('string', 'Area');
	data.addColumn('number', 'Latitude');
	data.addColumn('number', 'Longitude');
	// Create and draw the visualization.
	visualization = new google.visualization.Table(document.getElementById('table_canvas'));
	visualization.draw(data, null);
}

function selectHandler() {
	var selection = visualization.getSelection();
	var message = '';
	var lat1;
	var lng1;
	for (var i = 0; i < selection.length; i++) {
		var item = selection[i];
		if (item.row != null && item.column != null) {
			lat1 = data.getValue(item.row,2);
			lng1 = data.getValue(item.row,3);
		} else if (item.row != null) {
			lat1 = data.getValue(item.row,2);
			lng1 = data.getValue(item.row,3);
		} else if (item.column != null) {
			lat1 = data.getValue(item.row,2);
			lng1 = data.getValue(item.row,3);
		}
		var point = new GLatLng(lat1, lng1); 
		map.addOverlay(new GMarker(point));
	}
	if (message == '') {
		//do nothing
	}   
}
