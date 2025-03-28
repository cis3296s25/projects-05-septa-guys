
function getDelayClass(status) {
    if (status === 'Slightly Delayed') return 'slightly';
    if (status === 'Moderately Delayed') return 'moderately';
    if (status === 'Severely Delayed') return 'severely';
    return '';
}


async function fetchDelayedTrains() {
    const container = document.getElementById('delayed-trains-container');
    container.innerHTML = '<div class="loading">Loading current delays...</div>';
    
    try {
        console.log('Fetching train delays from API...');
        
        // Make sure the URL is correct (no typo with "1" at the end)
        const response = await fetch('/api/trains/delays', {
            signal: AbortSignal.timeout(5000) // Increased timeout
        });
        
        if (!response.ok) {
            console.error('API response not OK:', response.status, response.statusText);
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const delayedTrains = await response.json();
        console.log('Successfully fetched train data:', delayedTrains);
        
        const now = new Date();
        document.getElementById('last-updated').innerText = 
            `Last updated: ${now.toLocaleTimeString()} (from backend)`;
        
        displayDelayedTrains(delayedTrains);
    } catch (error) {
        console.warn('Backend not available, using mock data:', error);
        
        const now = new Date();
        document.getElementById('last-updated').innerText = 
            `Last updated: ${now.toLocaleTimeString()} (mock data)`;
            
        if (typeof MOCK_DELAYED_TRAINS !== 'undefined') {
            displayDelayedTrains(MOCK_DELAYED_TRAINS);
        } else {
            container.innerHTML = 
                '<div class="error-message">Unable to load delay information. Please try again later.</div>';
        }
    }
}

function displayDelayedTrains(trains) {
    const container = document.getElementById('delayed-trains-container');
    
    const delayedTrains = trains.filter(train => 
        train.status === 'Moderately Delayed' || 
        train.status === 'Severely Delayed'
    );
    
    if (delayedTrains.length === 0) {
        container.innerHTML = '<div class="no-delays">Good news! No significant delays reported at this time.</div>';
        return;
    }
    
    const delayCount = delayedTrains.length;
    const delayCountText = `<div class="delay-count">Currently showing ${delayCount} train${delayCount !== 1 ? 's' : ''} with significant delays</div>`;
    
    const trainsByLine = {};
    delayedTrains.forEach(train => {
        if (!trainsByLine[train.line]) {
            trainsByLine[train.line] = [];
        }
        trainsByLine[train.line].push(train);
    });
    
    let html = '<div class="delayed-trains-list">';
    
    Object.keys(trainsByLine).forEach(line => {
        trainsByLine[line].forEach(train => {
            const delayClass = getDelayClass(train.status);
            
            html += `
                <div class="train-card ${delayClass}">
                    <div class="train-info">
                        <h4>${line} Line - Train #${train.trainNumber}</h4>
                        <span class="delay-time">${train.delay} min</span>
                    </div>
                    <div class="train-detail">Status: ${train.status}</div>
                    <div class="train-detail">To: ${train.destination}</div>
                    <div class="train-detail">Next Stop: ${train.nextStop || 'N/A'}</div>
                </div>
            `;
        });
    });
    
    html += '</div>';
    container.innerHTML = delayCountText + html;
}

document.addEventListener('DOMContentLoaded', fetchDelayedTrains);