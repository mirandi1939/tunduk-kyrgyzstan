import axios from "axios";
import db from "./db/db.js";

const API_KEY = "AIzaSyChGyOnh3URpVonmVs0qo-vhqn1hQ5ahjU";

const PLACE_IDS = [
    "ChIJPSdKjhegj0cRIp5rM91QL94",
    "ChIJX0OtFkugj0cRhocu2FtBoRI",
    "ChIJMaM5MgGXj0cRsXlZyixRdnY",
    "ChIJW-an9UyOj0cRTntBAw1AnT8",
    "ChIJJVDUzSMCj0cRnjsRui5X0o0",
    "ChIJmX5EhG3UmkcRRqKDYUteuXo",
    "ChIJb-eP1NM6hUcRWyT8AuWcDkM",
    "ChIJ2UznzrAPj0cRcrAKDKb68cY",
    "ChIJm7T3DF6Ij0cRVGSZKUTFiok",
    "ChIJ2RvcpDD4jkcRN7pVOnwdtqY",
    "ChIJy6esKqNwhUcR8ymjWjccLVg",
    "ChIJ7W4t3enBj0cRWeLc8n0RGiE",
    "ChIJJUJ1mndFjkcRFigG6SoQb4Q",
    "ChIJRRz8Am9VjkcRTrXycrf2dMc",
    "ChIJC3cL1AnRkUcRGKlKpndAwP8",
    "ChIJgb5R8HpHkEcRl_XN0FgTqxE",
    "ChIJy-jxZ2juhEcRo_aG36TR1O0",
    "ChIJ3U5wcKYIj0cR7uRcOgtegTA",
    "ChIJVX-12qKZj0cRYYSzm0ZM5C8",
    "ChIJfVG-ly8km0cRlp7MZenwk1E",
    "ChIJZauAc3hWhUcRqa2XjSFbHQU",
    "ChIJPbgAuhTwj0cREOvEQPqZL3Q",
    "ChIJm5WjUABFhUcRlE4gDGDLYXI",
    "ChIJawy6WGNwj0cRU31SiVKxSoE"
];

async function fetchPlaceDetails(placeId) {
    const { data } = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
            params: {
                place_id: placeId,
                key: API_KEY,
                fields: "name,geometry,rating,user_ratings_total"
            }
        }
    );

    if (data.status !== "OK") {
        throw new Error(`${placeId} → ${data.status}`);
    }

    const r = data.result;

    return {
        google_place_id: placeId,
        name: r.name,
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        rating: r.rating ?? null,
        reviews_count: r.user_ratings_total ?? null
    };
}

function insertPlace(place) {
    return new Promise((resolve, reject) => {
        const sql = `
      INSERT OR IGNORE INTO places (
        name,
        lat,
        lng,
        rating,
        reviews_count,
        google_place_id,
        last_google_update
      )
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;

        const params = [
            place.name,
            place.lat,
            place.lng,
            place.rating,
            place.reviews_count,
            place.google_place_id
        ];

        db.run(sql, params, err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function run() {
    console.log("Starting Google Places seed...\n");

    for (const placeId of PLACE_IDS) {
        try {
            const place = await fetchPlaceDetails(placeId);
            await insertPlace(place);

            console.log(`✔ Added: ${place.name}`);
        } catch (err) {
            console.error(`✖ Failed for ${placeId}:`, err.message);
        }

        // защита от quota
        await new Promise(r => setTimeout(r, 200));
    }

    console.log("\nDone.");
    process.exit(0);
}

run();
