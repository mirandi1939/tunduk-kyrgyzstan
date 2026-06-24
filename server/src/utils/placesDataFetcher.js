import axios from "axios";

class GooglePlacesFetcher {
    async fetchFullPlace(placeId) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY_SERVER;

        const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
                params: {
                    place_id: placeId,
                    key: apiKey,
                    fields: "name,geometry,rating,user_ratings_total",
                },
            }
        );

        if (data.status !== "OK") {
            throw new Error(`Google API error: ${data.status}`);
        }

        const r = data.result;

        return {
            name: r.name,
            lat: r.geometry.location.lat,
            lng: r.geometry.location.lng,
            rating: r.rating ?? null,
            reviews_count: r.user_ratings_total ?? null,
        };
    }

    async fetchGoogleStats(placeId) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY_SERVER;

        const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
                params: {
                    place_id: placeId,
                    key: apiKey,
                    fields: "rating,user_ratings_total",
                },
            }
        );

        if (data.status !== "OK") {
            throw new Error(`Google API error: ${data.status}`);
        }

        const r = data.result;

        return {
            rating: r.rating ?? null,
            reviews_count: r.user_ratings_total ?? null,
        };
    }
}

export default new GooglePlacesFetcher();
