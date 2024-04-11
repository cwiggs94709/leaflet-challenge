// Define the API endpoint URL for fetching earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL using d3.json
d3.json(queryUrl).then(function(data) {
    // Once the data is fetched, create the map and add earthquake data
    createMap(data);
});

// Function to create the Leaflet map and add earthquake data
function createMap(earthquakeData) {
    // Create a tile layer for the base map
    let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
        maxZoom: 18
    });

    // Create a map centered at [0, 0] with streetMap as the base layer
    let myMap = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [streetMap]
    });

    // Function to determine marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 5; // Adjust this multiplier as needed
    }

    // Function to determine marker color based on earthquake depth
    function markerColor(depth) {
        return depth > 90 ? "#FF0000" :
               depth > 70 ? "#FF4500" :
               depth > 50 ? "#FF8C00" :
               depth > 30 ? "#FFD700" :
               depth > 10 ? "#FFFF00" :
                            "#ADFF2F"; // Green for shallow earthquakes
    }

    // Loop through each earthquake data point and create a marker
    earthquakeData.features.forEach(function(feature) {
        // Extract coordinates and properties
        let coordinates = feature.geometry.coordinates;
        let properties = feature.properties;

        // Create a circle marker with size and color based on magnitude and depth
        let marker = L.circleMarker([coordinates[1], coordinates[0]], {
            radius: markerSize(properties.mag),
            fillColor: markerColor(coordinates[2]), // Depth
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Bind a popup with information about the earthquake
        marker.bindPopup(`<h3>${properties.place}</h3><hr><p>Magnitude: ${properties.mag}<br>Depth: ${coordinates[2]} km</p>`);

        // Add the marker to the map
        marker.addTo(myMap);
    });

   // Create a legend to display depth ranges and their corresponding colors
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90]; // Depth intervals
    let colors = ['#ADFF2F', '#FFFF00', '#FFD700', '#FF8C00', '#FF4500', '#FF0000']; // Corresponding colors

    // Loop through depth intervals and generate a label with a colored square for each range
    for (let i = 0; i < depths.length; i++) {
        let depthRange = depths[i] + (i < depths.length - 1 ? "&ndash;" + depths[i + 1] : "+");
        let color = colors[i];
        div.innerHTML +=
            `<i style="background:${color}"></i> ${depthRange} km<br>`;
    }
    return div;
};

    // Add legend to the map
    legend.addTo(myMap);
}
