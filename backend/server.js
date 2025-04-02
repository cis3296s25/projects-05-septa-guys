const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// SEPTA API URLs
const SEPTA_API_BASE = 'https://www3.septa.org/hackathon/';
const TRAIN_VIEW_URL = `${SEPTA_API_BASE}TrainView/`;
const TRAIN_NEXT_TO_ARRIVE_URL = `${SEPTA_API_BASE}NextToArrive/`;
const TRAIN_SCHEDULE_URL = `${SEPTA_API_BASE}RRSchedules/`;



// Get all current train locations
app.get('/api/trains/locations', async (req, res) => {
  try {
    const response = await axios.get(TRAIN_VIEW_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching train locations:', error);
    res.status(500).json({ error: 'Failed to fetch train locations' });
  }
});

// Get next trains between two stations
app.get('/api/trains/next-to-arrive/:from/:to/:count?', async (req, res) => {
  try {
    const { from, to } = req.params;
    const count = req.params.count || 5; // Default to 5 trains
    
    const response = await axios.get(
      `${TRAIN_NEXT_TO_ARRIVE_URL}${from}/${to}/${count}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching next to arrive data:', error);
    res.status(500).json({ error: 'Failed to fetch next to arrive data' });
  }
});

// Get train schedule
app.get('/api/trains/schedule/:trainNumber/:day?', async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const day = req.params.day || ''; // Empty string defaults to current day
    
    const response = await axios.get(
      `${TRAIN_SCHEDULE_URL}${trainNumber}/${day}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching train schedule:', error);
    res.status(500).json({ error: 'Failed to fetch train schedule' });
  }
});

// Get all regional rail lines
app.get('/api/lines', async (req, res) => {
  try {
    // Hard-coded list of SEPTA Regional Rail lines
    const lines = [
      { id: 'AIR', name: 'Airport Line' },
      { id: 'CHE', name: 'Chestnut Hill East Line' },
      { id: 'CHW', name: 'Chestnut Hill West Line' },
      { id: 'CYN', name: 'Cynwyd Line' },
      { id: 'FOX', name: 'Fox Chase Line' },
      { id: 'LAN', name: 'Lansdale/Doylestown Line' },
      { id: 'MED', name: 'Media/Elwyn Line' },
      { id: 'NOR', name: 'Manayunk/Norristown Line' },
      { id: 'PAO', name: 'Paoli/Thorndale Line' },
      { id: 'TRE', name: 'Trenton Line' },
      { id: 'WAR', name: 'Warminster Line' },
      { id: 'WIL', name: 'Wilmington/Newark Line' },
      { id: 'WTR', name: 'West Trenton Line' }
    ];
    
    res.json(lines);
  } catch (error) {
    console.error('Error fetching lines:', error);
    res.status(500).json({ error: 'Failed to fetch lines' });
  }
});

// Get train delays
app.get('/api/trains/delays', async (req, res) => {
  try {
    const response = await axios.get(TRAIN_VIEW_URL);
    const trains = response.data;
    
    // Process trains to get delay information
    const delayedTrains = trains.map(train => {
      const delay = parseInt(train.late, 10);
      return {
        trainNumber: train.trainno,
        line: train.line,
        destination: train.dest,
        nextStop: train.nextstop,
        delay: delay,
        status: delay <= 0 ? 'On Time' : 
                delay <= 5 ? 'Slightly Delayed' : 
                delay <= 15 ? 'Moderately Delayed' : 'Severely Delayed',
        lat: train.lat,
        lon: train.lon,
        service: train.service,
        direction: train.direction
      };
    });
    
    res.json(delayedTrains);
  } catch (error) {
    console.error('Error fetching train delays:', error);
    res.status(500).json({ error: 'Failed to fetch train delays' });
  }
});

// Get stations for a specific rail line
app.get('/api/lines/:lineCode/stations', async (req, res) => {
  try {
    const { lineCode } = req.params;
    console.log(`Fetching stations for line: ${lineCode}`);
    
    // Hardcoded station data for testing
    const stationData = {
      'WTR': [
        { lat: 39.9526, lng: -75.1652, station: '30th Street Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Suburban Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Market East Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Temple University Station' },
        { lat: 39.9526, lng: -75.1652, station: 'North Broad Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Wayne Junction Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Germantown Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Mount Airy Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Chestnut Hill West Station' },
        { lat: 39.9526, lng: -75.1652, station: 'West Trenton Station' }
      ],
      'AIR': [
        { lat: 39.9526, lng: -75.1652, station: '30th Street Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Eastwick Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Terminal A Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Terminal B Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Terminal C Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Terminal D Station' },
        { lat: 39.9526, lng: -75.1652, station: 'Terminal E Station' }
      ]
    };

    const stations = stationData[lineCode];
    
    if (!stations) {
      throw new Error(`No station data available for line: ${lineCode}`);
    }
    
    console.log('Returning stations:', stations);
    res.json(stations);
  } catch (error) {
    console.error('Error fetching rail line stations:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch rail line stations',
      details: error.message,
      lineCode: req.params.lineCode
    });
  }
});

// Root path
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SEPTA Tracking API',
    version: '1.0.0',
    endpoints: {
      trainLocations: '/api/trains/locations',
      trainDelays: '/api/trains/delays',
      nextToArrive: '/api/trains/next-to-arrive/:from/:to/:count?',
      trainSchedule: '/api/trains/schedule/:trainNumber/:day?',
      lines: '/api/lines',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;