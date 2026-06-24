import db from "../db/db.js";

class ForumService {
    getAll({ category, women_only } = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM forum_posts WHERE is_approved = 1";
            const params = [];
            if (category && category !== "all") { sql += " AND category = ?"; params.push(category); }
            if (women_only === "1") sql += " AND is_women_specific = 1";
            sql += " ORDER BY created_at DESC";
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    create(post) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO forum_posts (author_name, author_country, title, content, category, is_women_specific) VALUES (?,?,?,?,?,?)`,
                [post.author_name, post.author_country || "", post.title, post.content, post.category || "general", post.is_women_specific ? 1 : 0],
                function(err) { err ? reject(err) : resolve(this.lastID); }
            );
        });
    }

    getPending() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM forum_posts WHERE is_approved = 0 ORDER BY created_at ASC", [], (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    approve(id) {
        return new Promise((resolve, reject) => {
            db.run("UPDATE forum_posts SET is_approved = 1 WHERE id = ?", [id], err => err ? reject(err) : resolve(true));
        });
    }

    deletePost(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM forum_posts WHERE id = ?", [id], err => err ? reject(err) : resolve(true));
        });
    }
}

export default new ForumService();
