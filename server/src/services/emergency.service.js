import db from "../db/db.js";

class EmergencyService {
    getAll({ category } = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM emergency_protocols WHERE 1=1";
            const params = [];
            if (category) { sql += " AND category = ?"; params.push(category); }
            sql += " ORDER BY priority DESC";
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }
}

export default new EmergencyService();
