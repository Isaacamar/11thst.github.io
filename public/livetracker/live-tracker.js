// L train stations (ordered from 8 Av in Manhattan to Canarsie-Rockaway in Brooklyn)
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
  
  // For demonstration, let's pretend "092600_L..N" is at station index 5 (Bedford Av).
  // We'll move it forward or backward every so often to simulate train movement.
  
  // Starting conditions:
  let currentTrainPosition = 5; // Bedford Av
  let directionIsNorth = true;  // 092600_L..N => Northbound
  
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
  
  function updateLights() {
    // For each station, figure out if it's behind or ahead of current position
    stations.forEach((_, idx) => {
      const lightEl = document.getElementById(`light-${idx}`);
  
      // Remove all classes first
      lightEl.className = 'light';
  
      if (idx < currentTrainPosition) {
        // Station is behind us => green
        lightEl.classList.add('passed');
      } else if (idx === currentTrainPosition) {
        // Current => special pulsing color
        lightEl.classList.add('current');
      } else {
        // Ahead => default red (no extra class needed)
      }
    });
  }
  
  function updateTrainPosition(newPos) {
    currentTrainPosition = newPos;
    document.getElementById('currentStation').textContent = stations[newPos];
    updateLights();
    updateStatus();
  }
  
  function updateStatus() {
    const userStation = parseInt(document.getElementById('userStation').value);
    const status = document.getElementById('status');
  
    if (!isNaN(userStation)) {
      const stopsAway = Math.abs(userStation - currentTrainPosition);
      const direction = (userStation < currentTrainPosition)
        ? 'Manhattan'
        : 'Brooklyn';
  
      status.innerHTML = `
        Your station: ${stations[userStation]}<br>
        Stops away from party: ${stopsAway}<br>
        Direction: Toward ${direction}<br>
        Estimated time: ${stopsAway * 2} minutes
      `;
    } else {
      status.textContent = 'Select your station to see how far away you are from the party train.';
    }
  }
  
  function updateDirectionDisplay() {
    const directionInfo = document.getElementById('directionInfo');
    const arrow = directionIsNorth ? '↑' : '↓';
    const dirText = directionIsNorth ? 'Northbound' : 'Southbound';
    directionInfo.textContent = `Direction: ${dirText} ${arrow}`;
  }
  
  // Example "simulate train movement" every 10 seconds
  // In real usage, you'd fetch a GTFS-RT feed & recalc currentTrainPosition
  function simulateMovement() {
    if (directionIsNorth) {
      if (currentTrainPosition < stations.length - 1) {
        currentTrainPosition++;
      } else {
        // Reached end, flip direction
        directionIsNorth = false;
        updateDirectionDisplay();
      }
    } else {
      // Southbound
      if (currentTrainPosition > 0) {
        currentTrainPosition--;
      } else {
        // Reached start, flip direction
        directionIsNorth = true;
        updateDirectionDisplay();
      }
    }
    updateTrainPosition(currentTrainPosition);
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    createStations();
    updateLights();
    updateDirectionDisplay(); // show arrow
    updateTrainPosition(currentTrainPosition);
  
    document.getElementById('userStation')
      .addEventListener('change', updateStatus);
  
    // Simulate movement every 10 seconds
    setInterval(simulateMovement, 10000);
  });
  