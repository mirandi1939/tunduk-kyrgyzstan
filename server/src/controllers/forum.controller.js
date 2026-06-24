import ForumService from "../services/forum.service.js";

class ForumController {
    async getAll(req, res) {
        try {
            res.json(await ForumService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching posts" });
        }
    }
    async create(req, res) {
        try {
            const { author_name, author_country, title, content, category, is_women_specific } = req.body;
            if (!author_name || !title || !content) {
                return res.status(400).json({ message: "author_name, title, and content are required" });
            }
            const id = await ForumService.create({ author_name, author_country, title, content, category, is_women_specific });
            res.status(201).json({ id, message: "Post submitted for review. Thank you!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error submitting post" });
        }
    }
}

export default new ForumController();
