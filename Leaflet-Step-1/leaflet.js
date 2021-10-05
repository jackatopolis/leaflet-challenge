
// Establish map
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 6
  });

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Importing Data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(response) {
    console.log(response)

    for (var i = 0; i < response.features.length; i++) {
        var location = response.features[i];
    
        if (location) {

            if (location.geometry.coordinates[2] < 10) {color = 'green'}
            else if (location.geometry.coordinates[2] < 30) {color = 'greenyellow'}
            else if (location.geometry.coordinates[2] < 50) {color = 'yellow'}
            else if (location.geometry.coordinates[2] < 70) {color = 'orange'}
            else if (location.geometry.coordinates[2] < 90) {color = 'orangered'}
            else {color = 'red'}

            L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]],
                {
                    color: 'black',
                    weight: 1,
                    fillColor: color,
                    fillOpacity: 0.6,
                    radius: Math.sqrt(Math.abs(location.properties.mag)) ** 2 * 10000
                })
                .bindPopup("<h3>Magnitude "+location.properties.mag+"</h3><hr>"
                    +'<span style="font-weight: bold">Location:</span> ' + location.properties.place 
                    + '<br><span style="font-weight: bold">Depth:</span> ' + location.geometry.coordinates[2]
                    + '<br><span style="font-weight: bold">ID:</span> ' + location.id
                    )
                .addTo(myMap)
        }
      }
    
      var legend = L.control({position: 'bottomright'});
      var colors = ['green','greenyellow','yellow','orange','orangered','red'];

      legend.onAdd = function (myMap) {
      
          var div = L.DomUtil.create('div', 'info legend'),
              grades = ['<10', '10-30', '30-50', '50-70', '70-90','>90'],
              labels = [];
          div.innerHTML += "<h4>Legend</h4>";
          div.innerHTML += "<h5>(Epicenter Depth)</h5>";
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < colors.length; i++) {
              div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i><span>' + grades[i] + '</span><br>'}
          return div;
      };
      
      legend.addTo(myMap);

});