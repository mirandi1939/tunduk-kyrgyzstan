import db from "../db/db.js";
import findAlternativePlaces from "../utils/placeAlternativesSearch.js";

class PlacesService {

    create(place) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO places (
                    name,
                    type,
                    lat,
                    lng,
                    region,
                    rating,
                    image_path,
                    reviews_count,
                    description,
                    google_place_id,
                    last_google_update
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `;

            const params = [
                place.name,
                place.type,
                place.lat,
                place.lng,
                place.region,
                place.rating,
                place.image_path,
                place.reviews_count,
                place.description || "",
                place.google_place_id,
            ];

            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    update(place) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE places SET
                                  name = ?,
                                  type = ?,
                                  lat = ?,
                                  lng = ?,
                                  region = ?,
                                  rating = ?,
                                  image_path = ?,
                                  reviews_count = ?,
                                  description = ?,
                                  last_google_update = datetime('now')
                WHERE google_place_id = ?
            `;

            const params = [
                place.name,
                place.type,
                place.lat,
                place.lng,
                place.region,
                place.rating,
                place.image_path,
                place.reviews_count,
                place.description || "",
                place.google_place_id,
            ];

            db.run(sql, params, err => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    updateGoogleStats(placeId, rating, reviewsCount) {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE places
            SET
                rating = ?,
                reviews_count = ?,
                last_google_update = datetime('now')
            WHERE google_place_id = ?
        `;

            db.run(sql, [rating, reviewsCount, placeId], err => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    async findAlternatives(googlePlaceId, limit = 5) {
        const originalPlace = await this.getOne(googlePlaceId);
        if (!originalPlace) {
            throw new Error("Original place not found");
        }

        const allPlaces = await this.getAll();

        const alternatives = findAlternativePlaces(
            originalPlace,
            allPlaces
        );

        return alternatives.slice(0, limit);
    }



    getOne(googlePlaceId) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM places WHERE google_place_id = ?",
                [googlePlaceId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM places ORDER BY rating DESC",
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    deleteOne(googlePlaceId) {
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM places WHERE google_place_id = ?",
                [googlePlaceId],
                err => {
                    if (err) reject(err);
                    else resolve(true);
                }
            );
        });
    }

    deleteAll() {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM places", err => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
}

export default new PlacesService();
