// Enhanced SEPTA Rail Line Display Module with Accurate Routing
const RailLineDisplay = (function () {
  let map = null;
  let lineMarkers = [];
  let linePolylines = [];
  let infoWindows = [];
  let lineLegend = null;
  let directionsService = null;

  // Initialize the module
  function init(googleMap) {
    map = googleMap;
    directionsService = new google.maps.DirectionsService();
    createLineLegend();
    setupLineSelector();
  }

  // Create a legend for the currently displayed line
  function createLineLegend() {
    lineLegend = document.createElement("div");
    lineLegend.className = "line-legend";
    document.querySelector(".commutes-map").appendChild(lineLegend);
  }

  // Set up the line selector dropdown
  function setupLineSelector() {
    const railLineSelect = document.getElementById("rail-line-select");

    // Clear existing options first
    railLineSelect.innerHTML = '<option value="">Select a line...</option>';

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
      clearRailLineFromMap();

      if (selectedLineId) {
        const lineData = RAIL_LINE_DATA[selectedLineId];
        // Show loading message
        updateLegendWithLoading(lineData.name);
        displayRailLineWithAccurateRouting(lineData.stations, selectedLineId);
      } else {
        lineLegend.classList.remove("visible");
      }
    });
  }

  // Show loading state in legend
  function updateLegendWithLoading(lineName) {
    lineLegend.innerHTML = `
      <div>
        <span class="line-color-indicator" style="background-color:#ccc"></span>
        <span><strong>${lineName}</strong></span>
      </div>
      <div><small>Loading accurate route...</small></div>
    `;
    lineLegend.classList.add("visible");
  }

  // Clear rail line display from map
  function clearRailLineFromMap() {
    // Close any open info windows
    infoWindows.forEach((infoWindow) => infoWindow.close());
    infoWindows = [];

    // Clear station markers
    lineMarkers.forEach((marker) => marker.setMap(null));
    lineMarkers = [];

    // Clear route polylines
    linePolylines.forEach((polyline) => polyline.setMap(null));
    linePolylines = [];
  }

  // Display rail line with accurate routing using transit directions
  async function displayRailLineWithAccurateRouting(stations, lineId) {
    const lineColor = RAIL_LINE_COLORS[lineId] || "#888888";
    const lineName = RAIL_LINE_DATA[lineId].name;

    // Create station markers first
    const bounds = new google.maps.LatLngBounds();
    stations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: station.station,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#FFFFFF",
          fillOpacity: 1,
          strokeColor: lineColor,
          strokeWeight: 3,
        },
        zIndex: 100, // Ensure markers appear above polylines
      });

      // Add info window for station
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="station-info-window">
            <h3>${station.station}</h3>
            <p><strong>${lineName}</strong></p>
            <p>SEPTA Regional Rail</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        // Close any open info windows
        infoWindows.forEach((window) => window.close());
        infoWindow.open(map, marker);
      });

      lineMarkers.push(marker);
      infoWindows.push(infoWindow);
      bounds.extend({ lat: station.lat, lng: station.lng });
    });

    // Get accurate transit routes between consecutive stations
    try {
      await drawAccurateTransitRoutes(stations, lineColor, lineName);
    } catch (error) {
      console.error('Error drawing accurate routes:', error);
      // Fallback to straight lines if directions fail
      drawStraightLineRoute(stations, lineColor);
    }

    // Update legend with final status
    const routeCount = linePolylines.length;
    lineLegend.innerHTML = `
      <div>
        <span class="line-color-indicator" style="background-color:${lineColor}"></span>
        <span><strong>${lineName}</strong></span>
      </div>
      <div><small>${stations.length} stations • ${routeCount} route segments</small></div>
    `;
    lineLegend.classList.add("visible");

    // Fit the map to show the entire line
    map.fitBounds(bounds);
  }

  // Fallback method for straight line routes
  function drawStraightLineRoute(stations, lineColor) {
    const routeCoordinates = stations.map((station) => ({
      lat: station.lat,
      lng: station.lng,
    }));

    const polyline = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: lineColor,
      strokeOpacity: 0.6,
      strokeWeight: 4,
      map: map,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4
        },
        offset: '0',
        repeat: '20px'
      }]
    });

    linePolylines.push(polyline);
  }

  // Draw accurate transit routes between stations using Directions API
  async function drawAccurateTransitRoutes(stations, lineColor, lineName) {
    let successfulRoutes = 0;
    let totalSegments = stations.length - 1;

    for (let i = 0; i < stations.length - 1; i++) {
      const origin = { lat: stations[i].lat, lng: stations[i].lng };
      const destination = { lat: stations[i + 1].lat, lng: stations[i + 1].lng };

      try {
        // Try multiple routing strategies
        let route = null;

        // Strategy 1: Try transit mode first
        route = await getDirectionsBetweenStations(origin, destination, 'TRANSIT');

        // Strategy 2: If transit fails, try driving (often follows similar paths)
        if (!route) {
          route = await getDirectionsBetweenStations(origin, destination, 'DRIVING');
        }

        if (route && route.overview_path && route.overview_path.length > 0) {
          // Create main route polyline
          const polyline = new google.maps.Polyline({
            path: route.overview_path,
            strokeColor: lineColor,
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: map,
            zIndex: 50,
          });

          // Add a subtle outline for better visibility
          const outlinePolyline = new google.maps.Polyline({
            path: route.overview_path,
            strokeColor: '#FFFFFF',
            strokeOpacity: 0.4,
            strokeWeight: 7,
            map: map,
            zIndex: 49,
          });

          linePolylines.push(polyline);
          linePolylines.push(outlinePolyline);
          successfulRoutes++;
        } else {
          // Create dashed straight line for failed segments
          console.warn(`Using straight line between ${stations[i].station} and ${stations[i + 1].station}`);
          const straightPolyline = new google.maps.Polyline({
            path: [origin, destination],
            strokeColor: lineColor,
            strokeOpacity: 0.5,
            strokeWeight: 3,
            map: map,
            zIndex: 50,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3
              },
              offset: '0',
              repeat: '15px'
            }]
          });
          linePolylines.push(straightPolyline);
        }

        // Update progress in legend
        updateLegendProgress(lineName, lineColor, i + 1, totalSegments, successfulRoutes);

        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error getting route between ${stations[i].station} and ${stations[i + 1].station}:`, error);

        // Fallback to straight line
        const straightPolyline = new google.maps.Polyline({
          path: [origin, destination],
          strokeColor: lineColor,
          strokeOpacity: 0.5,
          strokeWeight: 3,
          map: map,
          zIndex: 50,
          icons: [{
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              scale: 3
            },
            offset: '0',
            repeat: '15px'
          }]
        });
        linePolylines.push(straightPolyline);
      }
    }

    return { successfulRoutes, totalSegments };
  }

  // Update legend with loading progress
  function updateLegendProgress(lineName, lineColor, current, total, successful) {
    const percentage = Math.round((current / total) * 100);
    lineLegend.innerHTML = `
      <div>
        <span class="line-color-indicator" style="background-color:${lineColor}"></span>
        <span><strong>${lineName}</strong></span>
      </div>
      <div><small>Loading routes: ${current}/${total} (${percentage}%)</small></div>
      <div><small>${successful} accurate routes found</small></div>
    `;
  }

  // Get directions between two stations with enhanced error handling
  function getDirectionsBetweenStations(origin, destination, travelMode) {
    return new Promise((resolve) => {
      // Calculate distance to determine if we should even try directions
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(origin.lat, origin.lng),
        new google.maps.LatLng(destination.lat, destination.lng)
      );

      // If stations are very close (less than 500m), just use straight line
      if (distance < 500) {
        console.log(`Stations are very close (${Math.round(distance)}m), skipping directions API`);
        resolve(null);
        return;
      }

      const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode],
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: travelMode === 'TRANSIT',
        avoidTolls: travelMode === 'TRANSIT',
        region: 'US' // Bias towards US routes
      };

      // Add transit-specific options
      if (travelMode === 'TRANSIT') {
        request.transitOptions = {
          modes: [google.maps.TransitMode.TRAIN, google.maps.TransitMode.SUBWAY],
          routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
        };
      }

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result.routes.length > 0) {
          const route = result.routes[0];

          // Validate that the route makes sense
          if (route.overview_path && route.overview_path.length > 1) {
            console.log(`✓ Got ${travelMode} route with ${route.overview_path.length} points`);
            resolve(route);
          } else {
            console.warn(`Route has insufficient path points for ${travelMode}`);
            resolve(null);
          }
        } else {
          const errorMessages = {
            'NOT_FOUND': 'Route not found',
            'ZERO_RESULTS': 'No routes available',
            'OVER_QUERY_LIMIT': 'API quota exceeded',
            'REQUEST_DENIED': 'Request denied',
            'INVALID_REQUEST': 'Invalid request',
            'UNKNOWN_ERROR': 'Unknown error'
          };

          const errorMsg = errorMessages[status] || status;
          console.warn(`Directions request failed: ${errorMsg} for mode ${travelMode}`);
          resolve(null);
        }
      });
    });
  }

  // Alternative method: Use encoded polylines from GTFS data (if available)
  function displayRailLineWithGTFSData(stations, gtfsPolyline, lineId) {
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

    // Decode the GTFS polyline (if you have this data)
    const decodedPath = google.maps.geometry.encoding.decodePath(gtfsPolyline);

    const polyline = new google.maps.Polyline({
      path: decodedPath,
      strokeColor: lineColor,
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map,
    });

    linePolylines.push(polyline);

    // Add station markers
    stations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: station.station,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#FFFFFF",
          fillOpacity: 1,
          strokeColor: lineColor,
          strokeWeight: 3,
        },
        zIndex: 100,
      });

      lineMarkers.push(marker);
    });

    // Fit bounds
    const bounds = new google.maps.LatLngBounds();
    decodedPath.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);
  }

  // Public methods
  return {
    init: init,
    clearRailLine: clearRailLineFromMap,
    displayWithGTFS: displayRailLineWithGTFSData, // For future GTFS integration
  };
})();