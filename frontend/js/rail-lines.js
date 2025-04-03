// SEPTA Rail Line Display Module
const RailLineDisplay = (function () {
  let map = null;
  let lineMarkers = [];
  let linePolyline = null;
  let infoWindows = [];
  let lineLegend = null;

  // Standard SEPTA line colors
  const lineColors = {
    AIR: "#4F94CD", // Airport Line (Blue)
    CHE: "#CD5C5C", // Chestnut Hill East (Red)
    CHW: "#8B008B", // Chestnut Hill West (Purple)
    CYN: "#FF8C00", // Cynwyd Line (Orange)
    FOX: "#228B22", // Fox Chase Line (Green)
    LAN: "#FF6347", // Lansdale/Doylestown Line (Red-Orange)
    MED: "#4169E1", // Media/Elwyn Line (Blue)
    NOR: "#FF4500", // Manayunk/Norristown Line (Orange-Red)
    PAO: "#008B8B", // Paoli/Thorndale Line (Teal)
    TRE: "#00CED1", // Trenton Line (Turquoise)
    WAR: "#FF1493", // Warminster Line (Pink)
    WIL: "#9932CC", // Wilmington/Newark Line (Purple)
    WTR: "#FFD700", // West Trenton Line (Yellow)
  };

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

    // Fetch all rail lines and populate the dropdown
    fetch("/api/lines")
      .then((response) => response.json())
      .then((lines) => {
        lines.forEach((line) => {
          const option = document.createElement("option");
          option.value = line.id;
          option.textContent = line.name;
          railLineSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error loading rail lines:", error));

    // Handle rail line selection
    railLineSelect.addEventListener("change", function () {
      const selectedLineId = this.value;

      // Clear previous markers and polyline
      clearRailLineFromMap();

      if (selectedLineId) {
        // Show loading indicator (optional)
        lineLegend.innerHTML = "Loading stations...";
        lineLegend.classList.add("visible");

        // Fetch stations for the selected line
        fetch(`/api/lines/${selectedLineId}/stations`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            displayRailLine(data.stations, data.route, selectedLineId);
          })
          .catch((error) => {
            console.error("Error loading stations:", error);
            lineLegend.innerHTML = "Error loading station data.";
          });
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
  function displayRailLine(stations, route, lineId) {
    // Get line color based on lineId
    const lineColor = lineColors[lineId] || "#888888";
    const lineName =
      document.getElementById("rail-line-select").options[
        document.getElementById("rail-line-select").selectedIndex
      ].text;

    // Update legend
    lineLegend.innerHTML = `
        <div>
          <span class="line-color-indicator" style="background-color:${lineColor}"></span>
          <span><strong>${lineName}</strong></span>
        </div>
        <div><small>${stations.length} stations</small></div>
      `;
    lineLegend.classList.add("visible");

    // Create a polyline for the route if we have coordinates
    if (route && route.length > 1) {
      linePolyline = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: lineColor,
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: map,
      });
    }

    // Create markers for each station
    stations.forEach((station) => {
      if (!station.lat || !station.lng) return; // Skip stations without coordinates

      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: station.name,
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
              <h3>${station.name}</h3>
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
    if (stations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      stations.forEach((station) => {
        if (station.lat && station.lng) {
          bounds.extend({ lat: station.lat, lng: station.lng });
        }
      });
      map.fitBounds(bounds);
    }
  }

  // Return public methods
  return {
    init: init,
    clearRailLine: clearRailLineFromMap,
  };
})();
