// server.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const app = express();
const PORT = process.env.PORT || 3000;

// Optional: If you have an MTA_API_KEY in .env, you could do:
// require('dotenv').config();
// const MTA_API_KEY = process.env.MTA_API_KEY;

////////////////////////////////////////////////////////////////////////
// 1) Serve Static Files
////////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));

// 2) Basic Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/about.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/events.html'));
});

app.get('/mixes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/mixes.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/contact.html'));
});

////////////////////////////////////////////////////////////////////////
// 3) L Train Real-Time API Endpoint
////////////////////////////////////////////////////////////////////////
app.get('/api/l-train', async (req, res) => {
  try {
    // Official MTA endpoint for L line
    const MTA_LTRAIN_URL =
      'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l';
    
    // If MTA key required, add it here:
    // const headers = { 'x-api-key': MTA_API_KEY };
    // If no key needed, omit the headers entirely or use an empty object.

    const response = await fetch(MTA_LTRAIN_URL /*, { headers } */);
    if (!response.ok) {
      throw new Error(`MTA feed request failed with status ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    // Build a response object with only the data your front-end wants
    const tripUpdates = [];

    feed.entity.forEach((entity) => {
      if (entity.tripUpdate) {
        const { trip, stopTimeUpdate } = entity.tripUpdate;
        const direction =
          trip.directionId === 0 ? 'Northbound' : 'Southbound';

        tripUpdates.push({
          tripId: trip.tripId,
          route: trip.routeId,
          direction,
          stopTimeUpdates: stopTimeUpdate?.map((stu) => ({
            stopId: stu.stopId,
            arrival: stu.arrival?.time || null,
            departure: stu.departure?.time || null,
            delay: stu.arrival?.delay || 0,
          })),
        });
      }
    });

    // Return JSON so your front-end can parse it
    res.json({ success: true, data: tripUpdates });
  } catch (error) {
    console.error('Error fetching L train data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

////////////////////////////////////////////////////////////////////////
// 4) Start the Server
////////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
