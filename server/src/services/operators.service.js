import db from "../db/db.js";

class OperatorsService {
    getAll({ women_friendly, region } = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM operators WHERE 1=1";
            const params = [];
            if (women_friendly === "1") sql += " AND is_women_friendly = 1";
            if (region) { sql += " AND region = ?"; params.push(region); }
            sql += " ORDER BY is_verified DESC, rating DESC";
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    getOne(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM operators WHERE id = ?", [id], (err, row) => err ? reject(err) : resolve(row));
        });
    }
}

export default new OperatorsService();
