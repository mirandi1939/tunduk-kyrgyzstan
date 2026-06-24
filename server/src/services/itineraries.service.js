import db from "../db/db.js";

class ItinerariesService {
    getAll({ duration, women_friendly } = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM itineraries WHERE 1=1";
            const params = [];
            if (duration) { sql += " AND duration_days = ?"; params.push(+duration); }
            if (women_friendly === "1") sql += " AND is_women_friendly = 1";
            sql += " ORDER BY duration_days ASC";
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    getOne(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM itineraries WHERE id = ?", [id], (err, row) => err ? reject(err) : resolve(row));
        });
    }

    getDays(itineraryId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM itinerary_days WHERE itinerary_id = ? ORDER BY day_number ASC", [itineraryId], (err, rows) => err ? reject(err) : resolve(rows));
        });
    }
}

export default new ItinerariesService();
