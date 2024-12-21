require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public"
app.use(express.static('public'));

/**
 * Example: L Train endpoint
 * Calls the GTFS-RT feed for the L train, parses the protobuf data,
 * and returns an array of vehicle positions.
 */
app.get('/api/l-train', async (req, res) => {
  try {
    const mtaKey = process.env.MTA_API_KEY; // from .env
    if (!mtaKey) {
      throw new Error('MTA_API_KEY not found in .env');
    }

    // Fetch the L train GTFS feed
    const response = await fetch(
      'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l',
      { headers: { 'x-api-key': mtaKey } }
    );
    if (!response.ok) {
      throw new Error(`MTA feed request failed with status ${response.status}`);
    }

    // Parse the protobuf data
    const buffer = Buffer.from(await response.arrayBuffer());
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

    // Example: collect vehicle positions
    const vehiclePositions = feed.entity
      .filter((entity) => entity.vehicle && entity.vehicle.trip)
      .map((entity) => {
        return {
          tripId: entity.vehicle.trip.trip_id,
          currentStopId: entity.vehicle.stop_id,
          timestamp:
            entity.vehicle.timestamp?.toNumber &&
            entity.vehicle.timestamp.toNumber(),
        };
      });

    res.json({
      success: true,
      vehiclePositions,
    });
  } catch (err) {
    console.error('Error fetching L train data:', err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
