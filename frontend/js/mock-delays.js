const MOCK_DELAYED_TRAINS = [
    {
        trainNumber: "456",
        line: "Paoli/Thorndale",
        destination: "Thorndale",
        nextStop: "Ardmore",
        delay: 8,
        status: "Moderately Delayed",
        lat: 39.9653,
        lon: -75.1872,
        service: "LOCAL",
        direction: "OUTBOUND"
    },
    {
        trainNumber: "521",
        line: "Airport",
        destination: "Airport Terminal E-F",
        nextStop: "University City",
        delay: 15,
        status: "Moderately Delayed",
        lat: 39.9512,
        lon: -75.1819,
        service: "EXPRESS",
        direction: "OUTBOUND"
    },
    {
        trainNumber: "788",
        line: "Trenton",
        destination: "Trenton",
        nextStop: "North Philadelphia",
        delay: 22,
        status: "Severely Delayed",
        lat: 39.9628,
        lon: -75.1548,
        service: "LOCAL",
        direction: "OUTBOUND"
    },
    {
        trainNumber: "614",
        line: "Lansdale/Doylestown",
        destination: "Doylestown",
        nextStop: "Temple University",
        delay: 4,
        status: "Slightly Delayed",
        lat: 39.9813,
        lon: -75.1498,
        service: "LOCAL",
        direction: "OUTBOUND"
    },
    {
        trainNumber: "710",
        line: "Media/Elwyn",
        destination: "Elwyn",
        nextStop: "30th Street Station",
        delay: 12,
        status: "Moderately Delayed",
        lat: 39.9556,
        lon: -75.1782,
        service: "LOCAL",
        direction: "OUTBOUND"
    },
    {
        trainNumber: "332",
        line: "West Trenton",
        destination: "West Trenton",
        nextStop: "Jenkintown-Wyncote",
        delay: 18,
        status: "Severely Delayed",
        lat: 40.0892,
        lon: -75.1371,
        service: "EXPRESS",
        direction: "OUTBOUND"
    }
];

/*
async function fetchDelayedTrains() {
    const container = document.getElementById('delayed-trains-container');
    container.innerHTML = '<div class="loading">Loading current delays...</div>';
    
    try {
        const response = await fetch('http://localhost:3000/api/trains/delays', {
            signal: AbortSignal.timeout(3000)
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const delayedTrains = await response.json();
        
        const now = new Date();
        document.getElementById('last-updated').innerText = 
            `Last updated: ${now.toLocaleTimeString()} (from backend)`;

        displayDelayedTrains(delayedTrains);
    } catch (error) {
        console.warn('Backend not available, using mock data:', error);
        
        const now = new Date();
        document.getElementById('last-updated').innerText = 
            `Last updated: ${now.toLocaleTimeString()} (mock data)`;
            
        displayDelayedTrains(MOCK_DELAYED_TRAINS);
    }
}
    */