const MAX_DISTANCE_KM = 100;

function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = deg => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function findAlternativePlaces(originalPlace, allPlaces) {
    return allPlaces
        .filter(p => p.google_place_id !== originalPlace.google_place_id)

        .filter(p => p.type === originalPlace.type)

        .filter(
            p =>
                p.reviews_count !== null &&
                p.reviews_count < originalPlace.reviews_count
        )

        .map(p => {
            const distance = haversineDistance(
                originalPlace.lat,
                originalPlace.lng,
                p.lat,
                p.lng
            );

            return {
                ...p,
                distance_km: distance
            };
        })

        .filter(p => p.distance_km <= MAX_DISTANCE_KM)

        .sort((a, b) => {
            const scoreA =
                a.distance_km * 0.7 +
                (a.reviews_count / originalPlace.reviews_count) * 0.3;

            const scoreB =
                b.distance_km * 0.7 +
                (b.reviews_count / originalPlace.reviews_count) * 0.3;

            return scoreA - scoreB;
        });
}
