const RAIL_LINE_DATA = {
  AIR: {
    name: "Airport Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9512, lng: -75.1819, station: "Eastwick Station" },
      { lat: 39.8756, lng: -75.2419, station: "Terminal A Station" },
      { lat: 39.8756, lng: -75.2419, station: "Terminal B Station" },
      { lat: 39.8756, lng: -75.2419, station: "Terminal C Station" },
      { lat: 39.8756, lng: -75.2419, station: "Terminal D Station" },
      { lat: 39.8756, lng: -75.2419, station: "Terminal E Station" },
    ],
  },
  CHE: {
    name: "Chestnut Hill East Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9813, lng: -75.1498, station: "Temple University Station" },
      { lat: 40.0319, lng: -75.1508, station: "Wayne Junction Station" },
      { lat: 40.0319, lng: -75.1508, station: "Germantown Station" },
      { lat: 40.0319, lng: -75.1508, station: "Mount Airy Station" },
      { lat: 40.0319, lng: -75.1508, station: "Chestnut Hill East Station" },
    ],
  },
  CHW: {
    name: "Chestnut Hill West Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9813, lng: -75.1498, station: "Temple University Station" },
      { lat: 40.0319, lng: -75.1508, station: "Wayne Junction Station" },
      { lat: 40.0319, lng: -75.1508, station: "Germantown Station" },
      { lat: 40.0319, lng: -75.1508, station: "Mount Airy Station" },
      { lat: 40.0319, lng: -75.1508, station: "Chestnut Hill West Station" },
    ],
  },
  CYN: {
    name: "Cynwyd Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9653, lng: -75.1872, station: "Cynwyd Station" },
    ],
  },
  FOX: {
    name: "Fox Chase Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9813, lng: -75.1498, station: "Temple University Station" },
      { lat: 40.0319, lng: -75.1508, station: "Wayne Junction Station" },
      { lat: 40.0319, lng: -75.1508, station: "Fox Chase Station" },
    ],
  },
  LAN: {
    name: "Lansdale/Doylestown Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9813, lng: -75.1498, station: "Temple University Station" },
      { lat: 40.0319, lng: -75.1508, station: "Wayne Junction Station" },
      { lat: 40.0319, lng: -75.1508, station: "Lansdale Station" },
      { lat: 40.0319, lng: -75.1508, station: "Doylestown Station" },
    ],
  },
  MED: {
    name: "Media/Elwyn Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9556, lng: -75.1782, station: "University City Station" },
      { lat: 39.9556, lng: -75.1782, station: "Media Station" },
      { lat: 39.9556, lng: -75.1782, station: "Elwyn Station" },
    ],
  },
  NOR: {
    name: "Manayunk/Norristown Line",
    stations: [
      { lat: 39.9566, lng: -75.1816, station: "30th Street Station" },
      { lat: 39.9685, lng: -75.1965, station: "East Falls Station" },
      { lat: 40.0274, lng: -75.2223, station: "Manayunk Station" },
      { lat: 40.0331, lng: -75.2343, station: "Ivy Ridge Station" },
      { lat: 40.0697, lng: -75.2871, station: "Spring Mill Station" },
      { lat: 40.0831, lng: -75.3147, station: "Conshohocken Station" },
      { lat: 40.1012, lng: -75.3494, station: "Norristown Transportation Center" }
    ],
  },
  PAO: {
    name: "Paoli/Thorndale Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9653, lng: -75.1872, station: "Ardmore Station" },
      { lat: 39.9653, lng: -75.1872, station: "Paoli Station" },
      { lat: 40.0319, lng: -75.1508, station: "Thorndale Station" },
    ],
  },
  TRE: {
    name: "Trenton Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9628, lng: -75.1548, station: "North Philadelphia Station" },
      { lat: 40.2092, lng: -74.8171, station: "Trenton Station" },
    ],
  },
  WAR: {
    name: "Warminster Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9813, lng: -75.1498, station: "Temple University Station" },
      { lat: 40.0319, lng: -75.1508, station: "Wayne Junction Station" },
      { lat: 40.0319, lng: -75.1508, station: "Warminster Station" },
    ],
  },
  WIL: {
    name: "Wilmington/Newark Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9628, lng: -75.1548, station: "North Philadelphia Station" },
      { lat: 39.9628, lng: -75.1548, station: "Wilmington Station" },
      { lat: 39.9628, lng: -75.1548, station: "Newark Station" },
    ],
  },
  WTR: {
    name: "West Trenton Line",
    stations: [
      { lat: 39.9526, lng: -75.1652, station: "30th Street Station" },
      { lat: 39.9526, lng: -75.1652, station: "Suburban Station" },
      { lat: 39.9526, lng: -75.1652, station: "Market East Station" },
      { lat: 39.9813, lng: -75.1498, station: "Temple University Station" },
      { lat: 39.9813, lng: -75.1498, station: "North Broad Station" },
      { lat: 40.0319, lng: -75.1508, station: "Wayne Junction Station" },
      { lat: 40.0319, lng: -75.1508, station: "Germantown Station" },
      { lat: 40.0319, lng: -75.1508, station: "Mount Airy Station" },
      { lat: 40.0319, lng: -75.1508, station: "Chestnut Hill West Station" },
      { lat: 40.2092, lng: -74.8171, station: "West Trenton Station" },
    ],
  },
};

const RAIL_LINE_COLORS = {
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
