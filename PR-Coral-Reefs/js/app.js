var options = {
    center: [18.2208, -66.5901],
    zoom: 9
  }

  // create a Leaflet map in our division container with id of 'map'
  var map = L.map('map', options);

  // Leaflet providers base map URL
  var basemap_source =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  // Leaflet providers attributes
  var basemap_options = {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community</a>',
    subdomains: 'abcd',
    maxZoom: 19
  };

  // request some basemap tiles and add to the map
  var tiles = L.tileLayer(basemap_source, basemap_options).addTo(map);

// Load the CSV file using AJAX
fetch('/data/PR-Maria.csv')
.then(function (response) {
  // Parse the CSV into a useable format, then return it
  return response.text();
})
.then(function (csv) {
  // Parse the CSV data into a JavaScript object
  var data = Papa.parse(csv, { header: true, dynamicTyping: false }).data;
  // Loop through each row in the data and draw markers
  data.forEach(function (row) {
    drawMap(row);
  });
})
.catch(function (error) {
  console.log(error);
});

  addLegend();
//});

function drawMap(row) {
  var siteDamage = row.SiteDamage;
  var siteName = row.SiteName;
  var restorePotential = row.RestorePotential;


  // Create a circle marker based on the SiteDamage value
  var color, radius;
  if (siteDamage === "Minor") {
    color = "yellow";
    radius = 8;
  } else if (siteDamage === "Moderate") {
    color = "orange";
    radius = 8;
  } else if (siteDamage === "Severe") {
    color = "red";
    radius = 8;
  }

  // If a circle marker color was determined, create the marker and add it to the map
  if (color) {
    var circleMarker = L.circleMarker([row.Latitude, row.Longitude], {
      radius: radius,
      color: color,
      fillColor: color,
      fillOpacity: 0.8
    });

    circleMarker.addTo(map);
    // Add a tooltip popup to the circle marker
    circleMarker.bindPopup("<b>" + "Reef Name:" + siteName + "</b><br>" + 
                          "<br>" + "Restoration Potential: " + restorePotential);
  }
  //addLegend();
};

// Add legend to map
function addLegend() {
// create a new Leaflet control object, and position it top right
const legendControl = L.control({ position: "topright" });

// when the legend is added to the map
legendControl.onAdd = function () {
  const legend = L.DomUtil.create("div", "legend");
  legend.innerHTML += '<div><span style="background-color: yellow"></span>Minor</div>';
  legend.innerHTML += '<div><span style="background-color: orange"></span>Moderate</div>';
  legend.innerHTML += '<div><span style="background-color: red"></span>Severe</div>';
  
  // add a colored circle next to each legend item
  const legendItems = legend.querySelectorAll("div");
  legendItems.forEach(function(item) {
    const color = item.querySelector("span").style.backgroundColor;
    item.innerHTML = '<span style="display: inline-block; margin-left: 8px; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background-color: ' + color + '"></span>' + item.innerHTML;
  });

  return legend;
};
legendControl.addTo(map);
}