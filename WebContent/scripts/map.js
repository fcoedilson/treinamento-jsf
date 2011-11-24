var map;
var mapp;
var mapa;
var GDir1;
var GDir2;
var routes = [];
var GMAP_ROUTES = [];
var polylines = [];
var listaDistancias = [];
var normalProj;
var waypoints = [];
var gpolys = [];
var routeNodes = [];
var myNode;
var newMarkers = [];
var markerDragged;
var isDragged;
var lastIndex;
var prevIndex;
var num;
var cleaned = false;
var geocoder = null;
var pointToRemove;
var color = ["#0000FF"];


function loadPointsOnMap(){

	var points = document.getElementById("points").value;
	var arrayPoints = points.split('$');

	for ( var i = 0; i < arrayPoints.length; i+=3) {
		var elem = arrayPoints[i].split("#");
		var lat = elem[1];
		var lng = elem[2];
		var str = "";
		str += "lat:<b> " + lat + "</b><br/>";
		str += "lng:<b> " + lng + "</b><br/>";

		var markerIcon = createIcon();
		var markerOptions = {icon:markerIcon, draggable:false, bouncy:false, zIndexProcess:function(marker,b) {return 1;}};
		
		GEvent.addListener(map, "click", function() {
			var marker = new GMarker(new GLatLng(lat,lng));
			map.addOverlay(marker);
		});
	}
}

function createIcon() {

	var icon = new GIcon();
	icon.image = "../images/point.gif";
	icon.iconSize = new GSize(32, 32);
	icon.iconAnchor = new GPoint(16, 16);
	icon.infoWindowAnchor = new GPoint(16, 16);
	return icon;
}

function setRoutesListDirections(list){
	var d = new GDirections();
	this.routes.push(d);
	this.routes[routes.length - 1].loadFromWaypoints(list, {getPolyline:true, getSteps:true});
}

function distancia(){

	var poliline;
	var dist = 0;
	var soma = 0;
	var tempo = 0;
	var tempoTotal = 0;
	var trechos = [];
	var info = "Informacoes da Rota \r\n\r\n Distancias estimadas(em Km):\r\n\r\n";

	for ( var j = 0; j < routes.length; j++) {
		var poli = routes[j].getPolyline();
		if(poli){
			for ( var k = 0; k < poli.getVertexCount(); k++) {
				trechos.push(poli.getVertex(k));
			}
			poliline = new GPolyline(trechos, color[j], 3, 1);
			this.POLYLINES.push(poliline);
			map.addOverlay(poliline);
			trechos = [];
		}
	}

	var sumary;
	for (var p = 0; p < routes.length; p++) {
		if(routes[p].getDistance() && routes[p].getDuration()){
			dist = routes[p].getDistance().meters;
			tempo = routes[p].getDuration().seconds/3600;
			dist = dist/1000;
			soma += dist;
			tempoTotal += tempo;
			sumary += routes[p].getSummaryHtml() + "\r\n";
		}
	}
	//document.getElementById("distanciaTempo").innerHTML = "Distancia estimada: "+ soma.toString().substring(0,5) +" Km // Tempo aproximado: "+ Math.floor(tempoTotal) +" h " + Math.floor((tempoTotal - Math.floor(tempoTotal))*60) + " min" ;
}

function calculateBoundsRoute(){

	if(markerRoute){
		if (markerRoute.length > 0) {
			var mbr = new GLatLngBounds();
			for(var i = 0; i < markerRoute.length; i++) {
				mbr.extend(markerRoute[i]);
			}
			map.setCenter(mbr.getCenter(), map.getBoundsZoomLevel(mbr));
		}
	}
}

function clearCurrenteRoute2(){
	for ( var j = 0; j < polylines.length; j++) {
		map.removeOverlay(polylines[j]);
	}
	polylines = [];
}

function clearCurrenteRoute(){

	for ( var k = 0; k < this.gpolys.length; k++) {
		map.removeOverlay(this.gpolys[k]);
	}
	for ( var k = 0; k < this.waypoints.length; k++) {
		map.removeOverlay(this.waypoints[k]);
	}
	this.waypoints = new Array;
	this.gpolys = new Array;
	this.routeNodes = new Array;
	this.isDragged = 1;
	clearCurrenteRoute2();
}


function loadMaps() {
//	if (document.getElementById("mapponto")) {
//		createEditablePoint();
//	}
//	if (document.getElementById("maparea")) {
//		createEditablePolygon();
//	}
	if(document.getElementById ("map")){
		createMonitoringMap();
		loadPointsOnMap();
	}
//	updateMap();
}

function createMonitoringMap(){

	map = new google.maps.Map2(document.getElementById("map"), {draggableCursor:"crosshair"});
	map.setCenter(new GLatLng(-3.7325370241018394, -38.51085662841797), 12);
	map.addControl(new GMapTypeControl());
	map.addControl(new GSmallMapControl());
	map.addControl(new GScaleControl());
	map.addMapType(G_SATELLITE_3D_MAP);
	normalProj = G_NORMAL_MAP.getProjection();
	map.disableDoubleClickZoom();
	map.enableScrollWheelZoom();
	map.enableContinuousZoom();
	GDir1 = new GDirections();
	GDir2 = new GDirections();
	GEvent.addListener(map, 'load', setRoutesListDirections);
	GEvent.addListener(map, 'mousemove', getProximity);
	GEvent.addListener(map, "zoomend", function() {
		routeNodes = new Array();
	});

	GEvent.addListener(map, "click", function(overlay, point) {
		if (point) {
			if (waypoints.length == 0) {
				GDir1.loadFromWaypoints([point.toUrlValue(6), point.toUrlValue(6)], {getPolyline:true});
			} else {
				GDir1.loadFromWaypoints([waypoints[waypoints.length-1].getPoint(), point.toUrlValue(6)], {getPolyline:true});
			}
		}
	});

	iconNode = new GIcon();
	iconNode.image = "../images/node.gif";
	iconNode.shadow = ''; iconNode.iconSize = new GSize(10,10); iconNode.shadowSize = new GSize(0,0);
	iconNode.iconAnchor = new GPoint(5,5);
	iconNode.infoWindowAnchor = new GPoint(5,5);
	iconNode.dragCrossImage = '../images/empty.gif';
	iconNode.dragCrossSize = GSize(1, 1);
	iconNode.maxHeight = 1;
	myNode = new GMarker(map.getCenter(), {icon:iconNode, draggable:true, bouncy:false, zIndexProcess:function(marker,b) {return 1;}});
	map.addOverlay(myNode);
	myNode.show();
	myNode.hide();
	GEvent.addListener(myNode, "drag", function() {
		myNode.show();
		if (isDragged == 2) {
			markerDragged = myNode;
			return;
		}
		if (myNode.MyIndex < waypoints.length) {
			isDragged = 2;
			markerDragged = false;
			lastIndex = myNode.MyIndex;
			prevIndex = -1;
			GDir2.loadFromWaypoints([waypoints[lastIndex].getPoint(), myNode.getPoint().toUrlValue(6), waypoints[lastIndex + 1].getPoint()], {getPolyline:true});
		}
	});

	GEvent.addListener(myNode, "dragend", function() {
		var point = myNode.getPoint();
		var marker = new GMarker(point, {icon:iconNode, draggable:true, dragCrossMove:false, bouncy:false, zIndexProcess:function(marker,b) {return 1;}});
		waypoints.splice(myNode.MyIndex + 1, 0, marker);
		for (var i = myNode.MyIndex; i < waypoints.length; i++){
			waypoints[i].MyIndex = i;
		}
		var dummy = new GPolyline([point]);
		map.addOverlay(dummy);
		gpolys.splice(myNode.MyIndex + 1, 0, dummy);
		GEvent.addListener(marker, "dragstart", function() { isDragged = 1; myNode.hide(); });
		GEvent.addListener(marker, "dragend", function() { isDragged = 0; } );
		GEvent.addListener(marker, "drag", dragMarker);
		map.addOverlay(marker);

		if (myNode.MyIndex < waypoints.length) {
			lastIndex = myNode.MyIndex + 1;
			prevIndex = lastIndex - 1;
			GDir2.loadFromWaypoints([waypoints[lastIndex - 1].getPoint(),point.toUrlValue(6), waypoints[lastIndex + 1].getPoint()], {getPolyline:true});
		}
	});

	GEvent.addListener(GDir1, "load", function() {
		var gp = GDir1.getPolyline();
		var point = gp.getVertex(gp.getVertexCount() - 1);
		var marker = new GMarker(point, {icon:iconNode, draggable:true, dragCrossMove:false, bouncy:false, zIndexProcess:function(marker,b) {return 1;}});

		if (waypoints.length == 0) {
			marker.title = GDir1.getRoute(0).getStartGeocode().address;
		}
		else {
			waypoints[waypoints.length-1].title = GDir1.getRoute(0).getStartGeocode().address;
			marker.title = GDir1.getRoute(0).getEndGeocode().address
		}
		GEvent.addListener(marker, "dragstart", function() { isDragged = 1; myNode.hide(); });
		GEvent.addListener(marker, "drag", dragMarker);
		GEvent.addListener(marker, "dragend", function() { isDragged = 0; });
		marker.MyIndex = waypoints.length;
		waypoints.push(marker);
		map.addOverlay(marker);
		if (waypoints.length > 1) {
			map.addOverlay(gp);
			gpolys.push(gp);
			routeNodes = [];
			getProximity();
		}
	});

	GEvent.addListener(GDir2, "load", function() {
		var gp = GDir2.getPolyline();
		map.removeOverlay(gpolys[lastIndex]);

		if (prevIndex >= 0) {
			map.removeOverlay(gpolys[lastIndex-1]);
			var minD, minI, points=[];
			var p0 = waypoints[lastIndex].getPoint();
			for (var i = 0; i < gp.getVertexCount(); i++) {
				var p = gp.getVertex(i);
				points.push(p);
				var d = p0.distanceFrom(p);
				if (i == 0 || minD > d) {
					minD = d;
					minI = i;
				}
			}
			gpolys[lastIndex - 1] = new GPolyline(points.slice(0, minI + 1));
			gpolys[lastIndex] = new GPolyline(points.slice(minI, points.length));
			map.addOverlay(gpolys[lastIndex - 1]);
			waypoints[lastIndex-1].title = GDir2.getRoute(0).getStartGeocode().address;
			waypoints[lastIndex].title = GDir2.getRoute(0).getEndGeocode().address;
			waypoints[lastIndex+1].title = GDir2.getRoute(1).getEndGeocode().address;
		} else {
			gpolys[lastIndex] = gp;
			waypoints[lastIndex].title = GDir2.getRoute(0).getStartGeocode().address;
			waypoints[lastIndex+1].title = GDir2.getRoute(0).getEndGeocode().address;
		}

		map.addOverlay(gpolys[lastIndex]);
		routeNodes = [];
		getProximity();
		isDragged = 0;
		if (markerDragged) {
			isDragged = 1;
			GEvent.trigger(markerDragged, 'drag');
		}
	});

	map.checkResize();
	google.setOnLoadCallback(createMonitoringMap);

	try {
		if (initWikiCrimes) {
			initWikiCrimes(map,jQuery);
		}
	} catch (e) {}
}

function dragMarker() {
	if (isDragged == 2) {
		markerDragged = this;
		return;
	}
	isDragged = 2;
	if (markerDragged) {
		marker = markerDragged;
		markerDragged = false;
	} else {
		marker = this;
	}

	lastIndex = marker.MyIndex;
	var point = marker.getPoint();

	if (lastIndex > 0) {
		if (lastIndex < waypoints.length - 1) {
			prevIndex = lastIndex - 1;
			GDir2.loadFromWaypoints([waypoints[lastIndex - 1].getPoint(), point.toUrlValue(6), waypoints[lastIndex + 1].getPoint()],{getPolyline:true});
		} else {
			prevIndex = -1; lastIndex = lastIndex - 1;
			GDir2.loadFromWaypoints([waypoints[lastIndex].getPoint(),point.toUrlValue(6)],{getPolyline:true});
		}
	} else if (waypoints.length > 1) {
		prevIndex = -1;
		GDir2.loadFromWaypoints([point.toUrlValue(6),waypoints[1].getPoint()],{getPolyline:true});
	}
}

function getProximity(mouseLatLng, marker) {

	var dist, zoom;
	if (routeNodes.length == 0) {
		dist = 0;
		zoom = map.getZoom();
		if (gpolys.length > 0 && gpolys[0].getVertexCount() > 0 )
			routeNodes.push(normalProj.fromLatLngToPixel(gpolys[0].getVertex(0), zoom));
		for (var i = 0; i < gpolys.length; i++) {
			dist += gpolys[i].getLength();
			for (var j = 1; j < gpolys[i].getVertexCount(); j++) {
				var point = normalProj.fromLatLngToPixel(gpolys[i].getVertex(j), zoom)
				point.MyIndex = i;
				routeNodes.push(point);
			}
		}

		var panel = document.getElementById('panel');
		if (panel) {
			panel.innerHTML = (dist/1000).toFixed(1) + " km";
		}
	}

	if (!mouseLatLng || routeNodes.length <= 1 || isDragged > 0){
		return;
	}

	zoom = map.getZoom();
	var mousePx = normalProj.fromLatLngToPixel(mouseLatLng, zoom);
	var minDist = 999;
	var minX = mousePx.x;
	var minY = mousePx.y;

	if (routeNodes.length > 1) {
		var x,y, d1,d2,d;
		var dx = mousePx.x - routeNodes[0].x;
		var dy = mousePx.y - routeNodes[0].y;
		d2 = dx*dx + dy*dy;

		for (var n = 0 ; ++n < routeNodes.length; ) {
			d1 = d2;
			x = routeNodes[n].x; dx = mousePx.x - x;
			y = routeNodes[n].y; dy = mousePx.y - y;
			d2 = dx*dx + dy*dy;
			dx = x - routeNodes[n-1].x;
			dy = y - routeNodes[n-1].y;
			d = dx*dx + dy*dy;
			var u = ((mousePx.x - x) * dx + (mousePx.y - y) * dy) / d;
			x += (u*dx);
			y += (u*dy);
			dx = mousePx.x - x;
			dy = mousePx.y - y;
			dist = dx*dx + dy*dy;

			if ((d1 - dist) + (d2 - dist) > d) {
				if (d1 < d2) {
					dist = d1;
					x = routeNodes[n-1].x;
					y = routeNodes[n-1].y;
				} else {
					dist = d2;
					x = routeNodes[n].x;
					y = routeNodes[n].y;
				}
			};

			if (minDist > dist) {
				minDist = dist;
				minX = x;
				minY = y;
				myNode.MyIndex = routeNodes[n].MyIndex;
			}
		}

		if (minDist > 25) {
			myNode.hide();
		} else {
			for (n = waypoints.length; --n >= 0;) {
				var markerPx = normalProj.fromLatLngToPixel(waypoints[n].getPoint(), zoom);
				dx = markerPx.x - minX;
				dy = markerPx.y - minY;
				if (dx*dx + dy*dy < 25) {
					myNode.hide();
					return;
				}
			}
			myNode.setPoint(normalProj.fromPixelToLatLng(new GPoint(minX, minY), zoom));
			myNode.show();
		}
	}
}

function createEditablePolygon() {

	mapa = new google.maps.Map2(document.getElementById("maparea"));
	mapa.addControl(new GMapTypeControl());
	mapa.addControl(new GSmallMapControl());
	mapa.disableDoubleClickZoom();
	mapa.setCenter(new GLatLng(-3.7325370241018394, -38.51085662841797), 15);
	var polygon = new GPolygon([], '#008000', 2, 0.7, '#008000', 0.2);
	var element = document.getElementById('polygon');
	if (element && element.value) {
		var coords = element.value.split(',');
		for (var i = 0; i < coords.length; i++) {
			var coord = coords[i].split(' ');
			polygon.insertVertex(i, new GLatLng(coord[0],coord[1]));
		}
	} else {
		polygon.enableDrawing();
	}

	polygon.enableEditing({onEvent: "mouseover"});
	polygon.disableEditing({onEvent: "mouseout"});

	GEvent.addListener(polygon, "click", function(latlng, index) {
    	if (typeof index == "number") {
    		polygon.deleteVertex(index);
    	}
    });

	GEvent.addListener(polygon, "endline", function() {
    	polygon.setStrokeStyle({weight: 4});
    });

	GEvent.addListener(polygon, "lineupdated", function() {
		var element = document.getElementById('polygon');
		var encode = "";
		for (var i = 0; i < polygon.getVertexCount(); i++) {
			var p = polygon.getVertex(i);
			encode += p.lat() + " " + p.lng();
			if (i != (polygon.getVertexCount() -1)) {
				encode += ",";
			}
		}
		element.value = encode;
	});
	mapa.addOverlay(polygon);
	google.setOnLoadCallback(createEditablePolygon);
}

function createEditablePoint() {

	mapp = new google.maps.Map2(document.getElementById("map"));
	mapp.addControl(new GMapTypeControl());
	mapp.addControl(new GSmallMapControl());
	geocoder = new GClientGeocoder();
	mapp.disableDoubleClickZoom();
	var lat = document.getElementById("lat");
	var lng = document.getElementById("lng");
	GEvent.addListener(mapp, "click", function(overlay, point) {
	mapp.clearOverlays();
		if(point) {
			pointToRemove = point;
			lat.value = point.lat();
			lng.value = point.lng();
			mapp.setCenter(new GLatLng(lat.value, lng.value), 15);
			mapp.addOverlay(new GMarker(new GLatLng(lat.value, lng.value)));
		}
	});

	if (lat.value && lng.value) {
		mapp.setCenter(new GLatLng(lat.value, lng.value), 15);
		mapp.addOverlay(new GMarker(new GLatLng(lat.value, lng.value)));

	} else {
		mapp.setCenter(new GLatLng(-3.7325370241018394, -38.51085662841797), 13);
	}
	google.setOnLoadCallback(createEditablePoint);
}

function openKML( url ) {
	if (GBrowserIsCompatible()) {
		var geoXml = new GGeoXml( url );
		kmlMap = new google.maps.Map2(document.getElementById('kml_map'));
		kmlMap.setCenter(new GLatLng(-3.7325370241018394, -38.51085662841797), 13);
		kmlMap.addControl(GSmallMapControl);
		kmlMap.addControl(GMapTypeControl);
		kmlMap.addOverlay(geoXml);
	} else {
		window.alert('Navegador não compatível com o Google Maps.\nFavor instalar uma versão mais recente\nou utilizar outro navegador.');
	}
}
