import db from "../db/db.js";

class FoodService {
    getAll({ category, vegan, vegetarian } = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM food_items WHERE 1=1";
            const params = [];
            if (category) { sql += " AND category = ?"; params.push(category); }
            if (vegan === "1") sql += " AND is_vegan = 1";
            else if (vegetarian === "1") sql += " AND is_vegetarian = 1";
            sql += " ORDER BY priority DESC";
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }
}

export default new FoodService();
