var map = L.map("map").setView([39, -95.2663], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 9,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function getColor(metric, num) {
  if (metric == "gini") {
    if (num <= 0.05) return "#FFFFFF"; // White
    else if (num <= 0.1) return "#FFF7E0"; // Near White
    else if (num <= 0.15) return "#FFEFBF"; // ...
    else if (num <= 0.2) return "#FFE7A0";
    else if (num <= 0.25) return "#FFDF80";
    else if (num <= 0.3) return "#FFD760";
    else if (num <= 0.35) return "#FFCF40";
    else if (num <= 0.4) return "#FFC720";
    else if (num <= 0.45) return "#FFFF00"; // Yellow
    else if (num <= 0.5) return "#FFDA00";
    else if (num <= 0.55) return "#FFB500";
    else if (num <= 0.6) return "#FF9000";
    else if (num <= 0.65) return "#FF8000"; // Orange
    else if (num <= 0.7) return "#FF7000";
    else if (num <= 0.75) return "#FF6000";
    else if (num <= 0.8) return "#FF5000";
    else if (num <= 0.85) return "#FF4000";
    else if (num <= 0.9) return "#FF3000";
    else if (num <= 0.95) return "#FF2000";
    else return "#FF0000"; // Red
  } else if (metric == "income") {
    if (num < 30000) return "#FF0000"; // Red
    else if (num < 40000) return "#FF2000";
    else if (num < 50000) return "#FF4000";
    else if (num < 60000) return "#FF6000";
    else if (num < 70000) return "#FF8000";
    else if (num < 80000) return "#FFA000";
    else if (num < 90000) return "#FFC000";
    else if (num < 100000) return "#FFE000";
    else if (num < 105000) return "#A0FF00"; // Green
    else if (num < 115000) return "#20FF00"; // Green
    else return "#00FF00"; // Green
  } else if (metric == "poverty") {
    num = num * 100;
    if (num < 2) return "#00FF00"; // Green
    else if (num < 4) return "#1FE000";
    else if (num < 6) return "#3FC000";
    else if (num < 8) return "#5FA000";
    else if (num < 10) return "#7F8000";
    else if (num < 12) return "#9F6000";
    else if (num < 14) return "#BF4000";
    else if (num < 16) return "#DF2000";
    else if (num < 18) return "#FF0000"; // Starting to turn red
    else if (num < 20) return "#FF2000";
    else if (num < 22) return "#FF4000";
    else if (num < 24) return "#FF6000";
    else if (num < 26) return "#FF8000";
    else if (num < 28) return "#FFA000";
    else if (num < 30) return "#FFC000";
    else if (num < 32) return "#FFE000";
    else if (num < 34) return "#FFC0C0";
    else if (num < 36) return "#FF8080";
    else if (num < 38) return "#FF4040";
    else if (num < 40) return "#FF0000"; // Red
    else return "#FF0000"; // Red for anything 40% and above
  }
}

function giniStyle(feature) {
  return {
    fillColor: getColor((metric = "gini"), feature.properties.Gini_Index),
    weight: 0.5,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 0.5,
  };
}
function incomeStyle(feature) {
  return {
    fillColor: getColor((metric = "income"), feature.properties.Median_Income),
    weight: 0.5,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 0.7,
  };
}
function povertyStyle(feature) {
  return {
    fillColor: getColor((metric = "poverty"), feature.properties.Poverty_Rate),
    weight: 0.5,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 0.7,
  };
}

var geojson;

// –– FUNCTIONS FOR INTERACTING WITH COUNTIES ––

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

// connecting each function to the map
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

fetch("data/Geojson.json")
  .then((response) => response.json())
  .then((response) => {
    // geojson = L.geoJson(response, {
    //   style: style,
    //   onEachFeature: onEachFeature,
    // });
    // geojson.addTo(map);

    geojson = L.geoJson(response, {
      style: povertyStyle,
      onEachFeature: onEachFeature,
    });

    geojson.addTo(map);
    geojson.bringToBack();
  });

// Create a button element
var giniButton = L.control({ position: "topleft" });
var incomeButton = L.control({ position: "topleft" });
var povertyButton = L.control({ position: "topleft" });

// Define the content and behavior of the button
giniButton.onAdd = function (map) {
  var btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
  btn.innerHTML = "Gini Coefficient";

  // Add a click event listener to the button
  btn.addEventListener("click", function () {
    geojson.setStyle(giniStyle);
    geojson.options.style = giniStyle;
  });

  return btn;
};
incomeButton.onAdd = function (map) {
  var btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
  btn.innerHTML = "Median Income";

  // Add a click event listener to the button
  btn.addEventListener("click", function () {
    geojson.setStyle(incomeStyle);
    geojson.options.style = incomeStyle;
  });

  return btn;
};
povertyButton.onAdd = function (map) {
  var btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
  btn.innerHTML = "Poverty Rate";

  btn.addEventListener("click", function () {
    geojson.setStyle(povertyStyle);
    geojson.options.style = povertyStyle;
  });

  // Add a click event listener to the button

  return btn;
};

// Add the button to the map
giniButton.addTo(map);
incomeButton.addTo(map);
povertyButton.addTo(map);

// Custom Info Control

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  if (props) {
    const demographics = [
      { name: "White", percentage: props.White.toFixed(1) },
      { name: "Black", percentage: props.Black.toFixed(1) },
      {
        name: "American Indian/Alaskan",
        percentage: props["American Indian and Alaska Native"].toFixed(1),
      },
      { name: "Asian", percentage: props.Asian.toFixed(1) },
      // { name: "Pacific Islander", percentage: props["Native Hawaiian or Other Pacific Islander"].toFixed(1) },
      { name: "Other", percentage: props["Some Other Race"].toFixed(1) },
    ];

    // Sort the demographics in descending order based on percentage
    demographics.sort((a, b) => b.percentage - a.percentage);

    // Generate the labels and data arrays for the pie chart
    const labels = demographics.map((demographic) => demographic.name);
    const data = demographics.map((demographic) => demographic.percentage);

    // Create a canvas element for the chart
    const canvas = document.createElement("canvas");
    canvas.width = 250; // Increase the width to accommodate the labels
    canvas.height = 150;

    // Append the canvas to the info div
    this._div.innerHTML =
      "<h4>" +
      props.NAME +
      " County</h4><br />" +
      "Median Income: $" +
      props.Median_Income.toLocaleString() +
      "<br/>" +
      "Gini Index: " +
      props.Gini_Index +
      "<br/>" +
      "Poverty Rate: " +
      Math.round(props.Poverty_Rate * 100) +
      "%";
    ("<br/>");

    this._div.appendChild(canvas);

    // Create the pie chart using Chart.js
    new Chart(canvas, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#C9CBCF",
            ],
          },
        ],
      },
    });
  } else {
    this._div.innerHTML = "Hover over a county";
  }
};

info.addTo(map);

// ICONS

var libraryIcon = L.icon({
  iconUrl: "assets/img/library.png",
  iconSize: [20, 20],
  iconAnchor: [32, 32],
  popupAnchor: [-3, -70],
});

var bookIcon = L.divIcon({
  className: "book-icon",
  html: "📘",
  iconSize: [40, 40],
});

var libraries = [];
var library_group = null;

var poverty_libraries = {};

fetch("data/libraries.csv")
  .then((response) => response.text())
  .then((csvData) => {
    const rows = csvData.split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map((row) => row.split(","));

    data.forEach((row) => {
      try {
        const latitude = parseFloat(row[92]);
        const longitude = parseFloat(row[91]);

        const values = row.slice(114, 120);
        const keys = [
          "White",
          "Black",
          "American Indian/Alaskan Native",
          "Asian",
          "Other",
          "Two or more",
        ];

        const race_pcts = keys.reduce((acc, key, index) => {
          acc[key] = values[index];
          return acc;
        }, {});

        const sortedEntries = Object.entries(race_pcts).sort(
          (a, b) => b[1] - a[1]
        );
        const top3Entries = sortedEntries.slice(0, 3);

        let library = L.marker([latitude, longitude], {
          icon: bookIcon,
        })
          .bindTooltip(
            `
          <b>${row[125]}<b/>
          <br>
          <div>
          <p>
          ${row[5]}
          <div/>
          
          <div>
          State Rankings (Annual)
          <p>
          #${row[129]} in salaries
          <br>
          #${row[128]} in program attendance
          <br>
          #${row[130]} in total hours open (${row[62]})
          <br>
          #${row[131]} in total books owned
          
          <div/>
          
          <div>
          Neighborhood
          <p>
          Median Income: $${parseInt(row[124]).toLocaleString()}
          <br>
          1. ${top3Entries[0][0]} (${Math.round(top3Entries[0][1] * 100)}%)
          <br>
          2. ${top3Entries[1][0]} (${Math.round(top3Entries[1][1] * 100)}%)
          <br>
          3. ${top3Entries[2][0]} (${Math.round(top3Entries[2][1] * 100)}%)
          <br>
          

          
          
          <div/>


          <div>
          2019 Facts
          <p>
          Total Staff: ${Math.round(row[31])}
          <br>
          Total Books: ${row[52]}
          <br>
          Computer Uses (adjusted): ${
            row[81] !== 0 ? Math.round(row[82] / row[81]) : "N/A"
          }
          <br>
          Programs Hosted: ${row[75]} <br> (${row[76]} for kids, ${
              row[77]
            } for young adults)
          <div/>
          
          `
          )
          .openTooltip();

        if (row[121] < 5) {
          if (!poverty_libraries["<5% poverty"]) {
            poverty_libraries["<5% poverty"] = [];
          }
          poverty_libraries["<5% poverty"].push(library);
        } else if (row[121] < 10) {
          if (!poverty_libraries["5-10% poverty"]) {
            poverty_libraries["5-10% poverty"] = [];
          }
          poverty_libraries["5-10% poverty"].push(library);
        } else if (row[121] < 20) {
          if (!poverty_libraries["10-20% poverty"]) {
            poverty_libraries["10-20% poverty"] = [];
          }
          poverty_libraries["10-20% poverty"].push(library);
        } else if (row[121] < 30) {
          if (!poverty_libraries["20-30% poverty"]) {
            poverty_libraries["20-30% poverty"] = [];
          }
          poverty_libraries["20-30% poverty"].push(library);
        } else if (row[121] < 40) {
          if (!poverty_libraries["30-40% poverty"]) {
            poverty_libraries["30-40% poverty"] = [];
          }
          poverty_libraries["30-40% poverty"].push(library);
        } else {
          if (!poverty_libraries[">40% poverty"]) {
            poverty_libraries[">40% poverty"] = [];
          }
          poverty_libraries[">40% poverty"].push(library);
        }
      } catch {}
    });

    const overlayMaps = {};

    for (const key in poverty_libraries) {
      if (poverty_libraries.hasOwnProperty(key)) {
        const layerGroup = L.layerGroup(poverty_libraries[key]);
        overlayMaps[key] = layerGroup;
      }
    }

    console.log(overlayMaps);
    overlayMaps['5-10% poverty'].addTo(map)

    var layerControl = L.control
      .layers(null, overlayMaps, { collapsed: false })
      .addTo(map);
  });

  