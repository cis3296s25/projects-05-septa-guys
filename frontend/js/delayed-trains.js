
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