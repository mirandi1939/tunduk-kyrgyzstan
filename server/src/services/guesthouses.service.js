import db from "../db/db.js";

class GuesthousesService {
    getAll({ women_friendly, region, max_price, has_wifi } = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM guesthouses WHERE 1=1";
            const params = [];
            if (women_friendly === "1") sql += " AND is_women_friendly = 1";
            if (region) { sql += " AND region = ?"; params.push(region); }
            if (max_price) { sql += " AND price_per_night <= ?"; params.push(+max_price); }
            if (has_wifi === "1") sql += " AND has_wifi = 1";
            sql += " ORDER BY is_verified DESC, rating DESC";
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    getOne(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM guesthouses WHERE id = ?", [id], (err, row) => err ? reject(err) : resolve(row));
        });
    }
}

export default new GuesthousesService();
