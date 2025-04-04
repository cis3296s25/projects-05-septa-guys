// SEPTA Rail Line Display Module
const RailLineDisplay = (function () {
  let map = null;
  let lineMarkers = [];
  let linePolyline = null;
  let infoWindows = [];
  let lineLegend = null;

  // Initialize the module
  function init(googleMap) {
    map = googleMap;
    createLineLegend();
    setupLineSelector();
  }

  // Create a legend for the currently displayed line
  function createLineLegend() {
    // Create the legend container
    lineLegend = document.createElement("div");
    lineLegend.className = "line-legend";
    document.querySelector(".commutes-map").appendChild(lineLegend);
  }

  // Set up the line selector dropdown
  function setupLineSelector() {
    const railLineSelect = document.getElementById("rail-line-select");

    // Populate the dropdown with rail lines from our data
    Object.keys(RAIL_LINE_DATA).forEach((lineId) => {
      const option = document.createElement("option");
      option.value = lineId;
      option.textContent = RAIL_LINE_DATA[lineId].name;
      railLineSelect.appendChild(option);
    });

    // Handle rail line selection
    railLineSelect.addEventListener("change", function () {
      const selectedLineId = this.value;

      // Clear previous markers and polyline
      clearRailLineFromMap();

      if (selectedLineId) {
        const lineData = RAIL_LINE_DATA[selectedLineId];
        displayRailLine(lineData.stations, selectedLineId);
      } else {
        // Hide legend when no line is selected
        lineLegend.classList.remove("visible");
      }
    });
  }

  // Clear rail line display from map
  function clearRailLineFromMap() {
    // Close any open info windows
    infoWindows.forEach((infoWindow) => infoWindow.close());
    infoWindows = [];

    // Clear station markers
    lineMarkers.forEach((marker) => marker.setMap(null));
    lineMarkers = [];

    // Clear route polyline
    if (linePolyline) {
      linePolyline.setMap(null);
      linePolyline = null;
    }
  }

  // Display the rail line on the map
  function displayRailLine(stations, lineId) {
    // Get line color based on lineId
    const lineColor = RAIL_LINE_COLORS[lineId] || "#888888";
    const lineName = RAIL_LINE_DATA[lineId].name;

    // Update legend
    lineLegend.innerHTML = `
      <div>
        <span class="line-color-indicator" style="background-color:${lineColor}"></span>
        <span><strong>${lineName}</strong></span>
      </div>
      <div><small>${stations.length} stations</small></div>
    `;
    lineLegend.classList.add("visible");

    // Create a polyline for the route
    const routeCoordinates = stations.map((station) => ({
      lat: station.lat,
      lng: station.lng,
    }));

    linePolyline = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: lineColor,
      strokeOpacity: 1.0,
      strokeWeight: 5,
      map: map,
    });

    // Create markers for each station
    stations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: station.station,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#FFFFFF",
          fillOpacity: 1,
          strokeColor: lineColor,
          strokeWeight: 3,
        },
        className: "station-marker",
      });

      // Add info window for station
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="station-info-window">
            <h3>${station.station}</h3>
            <p>SEPTA Regional Rail Station</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        // Close any open info windows
        infoWindows.forEach((window) => window.close());

        // Open this info window
        infoWindow.open(map, marker);
      });

      lineMarkers.push(marker);
      infoWindows.push(infoWindow);
    });

    // Fit the map to show the entire line
    const bounds = new google.maps.LatLngBounds();
    stations.forEach((station) => {
      bounds.extend({ lat: station.lat, lng: station.lng });
    });
    map.fitBounds(bounds);
  }

  // Return public methods
  return {
    init: init,
    clearRailLine: clearRailLineFromMap,
  };
})();
