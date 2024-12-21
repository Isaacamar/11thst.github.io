// server.js
const express = require('express');
const fetch = require('node-fetch');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// L train stations in order
const L_STATIONS = [
    { id: 'L01', name: '8th Avenue', stopId: 'L01N' },
    { id: 'L02', name: '6th Avenue', stopId: 'L02N' },
    { id: 'L03', name: '14th Street / Union Square', stopId: 'L03N' },
    { id: 'L05', name: '3rd Avenue', stopId: 'L05N' },
    { id: 'L06', name: '1st Avenue', stopId: 'L06N' },
    { id: 'L08', name: 'Bedford Avenue', stopId: 'L08N' },
    { id: 'L10', name: 'Lorimer Street', stopId: 'L10N' },
    { id: 'L11', name: 'Graham Avenue', stopId: 'L11N' },
    { id: 'L12', name: 'Grand Street', stopId: 'L12N' },
    { id: 'L13', name: 'Montrose Avenue', stopId: 'L13N' },
    { id: 'L14', name: 'Morgan Avenue', stopId: 'L14N' },
    { id: 'L15', name: 'Jefferson Street', stopId: 'L15N' },
    { id: 'L16', name: 'DeKalb Avenue', stopId: 'L16N' },
    { id: 'L17', name: 'Myrtle - Wyckoff Avenues', stopId: 'L17N' },
    { id: 'L19', name: 'Halsey Street', stopId: 'L19N' },
    { id: 'L20', name: 'Wilson Avenue', stopId: 'L20N' },
    { id: 'L21', name: 'Bushwick Avenue - Aberdeen Street', stopId: 'L21N' },
    { id: 'L22', name: 'Broadway Junction', stopId: 'L22N' },
    { id: 'L24', name: 'Atlantic Avenue', stopId: 'L24N' },
    { id: 'L25', name: 'Sutter Avenue', stopId: 'L25N' },
    { id: 'L26', name: 'Livonia Avenue', stopId: 'L26N' },
    { id: 'L27', name: 'New Lots Avenue', stopId: 'L27N' },
    { id: 'L28', name: 'East 105th Street', stopId: 'L28N' },
    { id: 'L29', name: 'Canarsie - Rockaway Parkway', stopId: 'L29N' }
];

// MTA API endpoint
const MTA_API_ENDPOINT = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l';
const API_KEY = process.env.MTA_API_KEY || 'YOUR_API_KEY_HERE';

// Fetch train data from MTA API
async function fetchTrainData() {
    try {
        const response = await fetch(MTA_API_ENDPOINT, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
            new Uint8Array(buffer)
        );

        return processFeedData(feed);
    } catch (error) {
        console.error('Error fetching MTA data:', error);
        return null;
    }
}

function processFeedData(feed) {
    const trains = [];
    
    feed.entity.forEach(entity => {
        if (entity.tripUpdate && entity.tripUpdate.trip) {
            const updates = entity.tripUpdate.stopTimeUpdate;
            if (updates && updates.length > 0) {
                const currentStop = updates[0].stopId;
                const train = {
                    tripId: entity.tripUpdate.trip.tripId,
                    currentStation: currentStop,
                    nextStops: updates.map(update => ({
                        stopId: update.stopId,
                        arrivalTime: update.arrival ? update.arrival.time : null
                    }))
                };
                trains.push(train);
            }
        }
    });

    return trains;
}

// API endpoint to get train positions
app.get('/api/trains', async (req, res) => {
    const trainData = await fetchTrainData();
    res.json(trainData || { error: 'Failed to fetch train data' });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});