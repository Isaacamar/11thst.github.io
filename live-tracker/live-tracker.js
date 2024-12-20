const stations = [
    '8 Av',
    '6 Av',
    '14 St-Union Sq',
    '3 Av',
    '1 Av',
    'Bedford Av',
    'Lorimer St',
    'Graham Av',
    'Grand St',
    'Montrose Av',
    'Morgan Av',
    'Jefferson St',
    'DeKalb Av',
    'Myrtle-Wyckoff',
    'Halsey St',
    'Wilson Av',
    'Bushwick Av',
    'Broadway Junction',
    'Atlantic Av',
    'Sutter Av',
    'Livonia Av',
    'New Lots Av',
    'East 105 St',
    'Canarsie-Rockaway'
];

let currentTrainPosition = 5; // Temporary: Starting at Bedford Av

function createStations() {
    const stationList = document.getElementById('stationList');
    const userSelect = document.getElementById('userStation');
    
    stations.forEach((station, index) => {
        // Create station in visualization
        const stationDiv = document.createElement('div');
        stationDiv.className = 'station';
        stationDiv.innerHTML = `
            <div class="station-marker">
                <div class="light" id="light-${index}"></div>
            </div>
            <div class="station-name">${station}</div>
        `;
        stationList.appendChild(stationDiv);

        // Add to select dropdown
        const option = document.createElement('option');
        option.value = index;
        option.textContent = station;
        userSelect.appendChild(option);
    });
}

function updateTrainPosition(position) {
    // Reset all lights
    stations.forEach((_, index) => {
        document.getElementById(`light-${index}`).className = 'light';
    });

    // Set train position light to green
    document.getElementById(`light-${position}`).className = 'light active';
    document.getElementById('currentStation').textContent = stations[position];
    
    // Update status if user has selected a station
    updateStatus();
}

function updateStatus() {
    const userStation = parseInt(document.getElementById('userStation').value);
    const status = document.getElementById('status');

    if (!isNaN(userStation)) {
        const stopsAway = Math.abs(userStation - currentTrainPosition);
        const direction = userStation < currentTrainPosition ? 'Manhattan' : 'Brooklyn';

        status.innerHTML = `
            Your station: ${stations[userStation]}<br>
            Stops away from party: ${stopsAway}<br>
            Direction: Toward ${direction}<br>
            Estimated time: ${stopsAway * 2} minutes
        `;
    }
}

// Initialize the display
document.addEventListener('DOMContentLoaded', () => {
    createStations();
    
    // Add event listeners
    document.getElementById('userStation').addEventListener('change', updateStatus);

    // Initial train position
    updateTrainPosition(currentTrainPosition);
    
    // Temporary: Move train every 10 seconds (replace with real-time updates)
    setInterval(() => {
        currentTrainPosition = (currentTrainPosition + 1) % stations.length;
        updateTrainPosition(currentTrainPosition);
    }, 10000);
});

/* 
// TODO: Replace with real MTA GTFS-Realtime data
async function fetchTrainLocation() {
    try {
        const response = await fetch('MTA_API_ENDPOINT');
        const data = await response.json();
        // Update train position based on real data
        updateTrainPosition(newPosition);
    } catch (error) {
        console.error('Error fetching train location:', error);
    }
}
*/