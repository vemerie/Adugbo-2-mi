//AWS declarations

AWS.config.update({
    region: "us-east-2",
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    // accessKeyId default can be used while using the downloadable version of DynamoDB.
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "AKIAI2NFDPN2IUMLX7NA",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB.
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "IRnJFLyVA1ssVmPAne9Ss0h8koqolsbPJlYP02X0"
});

var docClient = new AWS.DynamoDB.DocumentClient();

//map functions
//declarations
var planes = [
    ["7C6B07",-40.99497,174.50808],
    ["7C6B38",-41.30269,173.63696],
    ["7C6CA1",-41.49413,173.5421],
    ["7C6CA2",-40.98585,174.50659],
    ["C81D9D",-40.93163,173.81726],
    ["C82009",-41.5183,174.78081],
    ["C82081",-41.42079,173.5783],
    ["C820AB",-42.08414,173.96632],
    ["C820B6",-41.51285,173.53274]
];
//map'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

var layer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    {attribution: 'Tiles &copy; Esri'
    });
var map = L.map('map', {
    scrollWheelZoom: false,
    center: [8.2794604835,25.4219245467],
    zoom: 3,
    worldCopyJump: true,
    trackResize: true,
    closePopupOnClick:true

});

map.on('click', function(e) {
    console.log(e.latlng);

    $.ajax({
        url: 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +e.latlng.lat+'&lon='+e.latlng.lng,
        //data: {
        //	format: 'jsonv2'
        //},
        success: function (data) {
            var state = data.address.state;
            var country = data.address.country;
            var city = data.address.city;
            var village = data.address.village;


            $('#country').text(country);
            $('#state').text(state);
            $('#city').text(city);
            document.getElementById('addressContainer').style.backgroundColor="white";
            $('#coordinate').text("coordinate: " +e.latlng.lat+", "+e.latlng.lat);

            var params = {
                IndexName: 'Country-State-index',
                ExpressionAttributeValues: {
                    ':s': country,
                    ':e':state,
                },
                ExpressionAttributeNames:{
                    "#st": "State"
                },
                KeyConditionExpression: 'Country = :s and #st = :e',
                TableName: 'VideoImage'
            };

            getData(params);

        },
        type: 'GET'
    });
});


function getData(params){
    docClient.query(params, function(err, data) {
        if (err) {
            document.getElementById('textarea').innerHTML = "Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
                //console.log("comments:" + data.Item.ImageUrl);
                document.getElementById('textarea').innerHTML = "GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 1);
                //var videoU = data.Item.ImageUrl;
                document.getElementById('user').innerHTML = data.Item.UserId;
                //document.getElementById("source").src=videoU;

            }
        });
}


map.addLayer(layer);
// control that shows info on hover
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();

    return this._div;
};

//Icons

map.on('click',function(e){
     var myIcon = L.icon({
        iconUrl: './assets/img/maker.png',
        iconSize: [38, 40],
        iconAnchor: [40, 40],
        popupAnchor: [-3, -76],
        //shadowUrl: 'my-icon-shadow.png',
        shadowSize: [68, 95],
        shadowAnchor: [50, 50]
    });
    var marker = L.marker([e.latlng.lat, e.latlng.lng],{title: 'Hover Text', icon: myIcon}).addTo(map).bindPopup("<strong>" + e.latlng + "</strong>");});

   //.bindPopup("<b>Te Papa</b><br>Museum of New Zealand.")
//.openPopup()



/*multiple markers
for (var i = 0; i < planes.length; i++) {
    marker = new L.marker([planes[i][1],planes[i][2]],{icon:myIcon})
        .bindPopup(planes[i][0])
        .addTo(map);
}*/

//osm
var osmGeocoder = new L.Control.OSMGeocoder({
    collapsed: false,
    position: 'topright',
    text: 'Find!',
    color: '#66bc29',

});
map.addControl(osmGeocoder);


// the heat map
var heat = L.heatLayer(quakePoints,{
    radius: 20,
    blur: 15,
    maxZoom: 17,
}).addTo(map);


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
var statesData;

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

geojson = L.geoJson(statesData, {
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
}



//legend.addTo(map);
map.scrollWheelZoom.disable();




/*
 function readItem() {
 var country = "country";
 var  state= "state";
 var  city= "city";

 var params = {
 TableName: table,
 Key:{
 "Comments":Comments,
 "UserId": UserId

 }
 };


 var params = {
 ExpressionAttributeValues: {
 ':s': 'country',
 ':e':'State',
 ':c':'city'
 },
 KeyConditionExpression: 'country = :s and state = :e',
 TableName: 'VideoImage'
 };
 docClient.query(params, function(err, data) {
 if (err) {
 document.getElementById('textarea').innerHTML = "Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2);
 } else {
 console.log("comments:" + data.Item.ImageUrl);
 document.getElementById('textarea').innerHTML = "GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 1);
 var videoU=data.Item.ImageUrl;
 }
 document.getElementById('textare').innerHTML = "GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
 document.getElementById('had').innerHTML =data.Item.Comment ;
 document.getElementById('user').innerHTML = data.Item.state;
 //document.getElementById("source").src=videoU;

 });
 }*/

// $(function(){$('#readItem').click(readItem)});
/*var videoU = Item.VideoUrl;
 document.getElementById("source").src=VideoU;
 var x = document.getElementById("source").src;
 document.write(x);*/


/*node js
 var http = require('http');

 http.createServer(function (req, res) {
 res.writeHead(200, {'Content-Type': 'text/html'});
 res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
 res.write('<input type="file" name="filetoupload"><br>');
 res.write('<input type="submit">');
 res.write('</form>');
 return res.end();
 }).listen(8080);
 */