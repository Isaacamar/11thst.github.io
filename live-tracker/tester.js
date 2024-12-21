const protobuf = require('protobufjs');

/**
 * Fetches GTFS data from the MTA API, unzips it, and parses the Protobuf file.
 */
async function fetchAndParseGTFSData(apiUrl) {
    try {
        // Fetch the ZIP file from the API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        // Read the response as a buffer
        const buffer = await response.arrayBuffer();
		console.log("The buffer is " + buffer.byteLength + " bytes long.");


        // Load the Protobuf schema
        const root = await protobuf.load('gtfs-realtime.proto'); // Provide the path to the GTFS-Realtime schema
        const FeedMessage = root.lookupType('transit_realtime.FeedMessage');

		//console.log(FeedMessage);

        // Decode the Protobuf data
        const decodedData = FeedMessage.decode(new Uint8Array(buffer));
		jsonData = decodedData.toJSON();
		console.log(jsonData["entity"][0]);
		console.log("\n\n\n");
		console.log(decodedData.toJSON());
		// for (var key in decodedData) {
		// 	console.log(decodedData[key]);
		// }

        // Convert Protobuf message to a plain object
        const plainObject = FeedMessage.toObject(decodedData, {
            enums: String, // Convert enums to strings
            longs: String, // Convert longs to strings
            defaults: true, // Include default values
        });

        return plainObject;
    } catch (error) {
        console.error('Error fetching or parsing GTFS data:', error);
        throw error;
    }
}

// Usage example
const API_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l';

fetchAndParseGTFSData(API_URL)
    .then(data => console.log('Parsed GTFS Data:'))
    .catch(error => console.error('Error:', error));