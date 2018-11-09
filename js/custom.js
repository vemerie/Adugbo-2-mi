
//video and map show section

$(document).ready(function(){
    $('#showVideo').click(function(){
        $('#video').fadeIn();
        $('#mapid').hide();
    });


    $('#showMap').click(function(){
        $('#video').hide();
		$('#mapid').fadeIn();
	});

	$('#icon-show-map-video').click(function(){
        $('#id="icon-links-sub"').hide();
	});

});


	$(document).ready(function(){
    // close button for dashboard
    $('#close-icon').click(function() {
		$('#side-dashboard').fadeOut();
		$('#arrow').fadeIn();
      });

	  $('#arrow').click(function() {
		$('#side-dashboard').fadeIn();
		$('#arrow').css("display","none");
      });



      // dark theme
 
      $('#dark-theme').click(function(){
        $('body').css("background-color","black");
       
    });
});


//map

			var layer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri'
			});
			var map = L.map('mapid', {
				scrollWheelZoom: false,
				center: [8.2794604835,25.4219245467],
				zoom: 3,
				worldCopyJump: true,
				trackResize: true,
				closePopupOnClick:true

			});

			map.addLayer(layer);
	// control that shows info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();

		return this._div;
	};





	info.update = function (props) {
		this._div.innerHTML = (props ?
	// output country details including name, region, how many programs, and the list of programs that link to the program
	props.name
	// This is to show users that they can click on to highlighted country.
	: 'Click on a country to see details of that country.');
	};

	info.addTo(map);

	function getColor(d) {
		return d < 200 ? '#489e0b' :
		d < 0 ? '#66bc29' :
		'#66bc29';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: '#66bc29',
			solidArray: '3',
			fillOpacity: .6,
			fillColor: getColor(feature.properties.density)
		};

	}

	function highlightFeature(e) {

		var layer = e.target;

		layer.setStyle({
			weight: 4,
	color: '#489e0b', //green
	solidArray: '7',
	fillOpacity: .7
	});
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			click:highlightFeature,
			mouseover:highlightFeature,
			mouseout:resetHighlight
		});

		layer.bindPopup(feature.properties.name);


	}

	var circle = L.circle([14.7502777778, -44.9686111111], .01, {
		color: '489e0b',
		fillOpacity: 0
	}).addTo(map);
	circle.bindPopup('<h4>Click on a Country to view available programs.</h4>')
	.openPopup();

	geojson = L.geoJson(countryData2, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),

		labels = [],
		from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};



	//legend.addTo(map);
	map.scrollWheelZoom.disable();

