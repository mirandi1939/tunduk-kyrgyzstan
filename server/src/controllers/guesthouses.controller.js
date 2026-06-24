import GuesthousesService from "../services/guesthouses.service.js";

class GuesthousesController {
    async getAll(req, res) {
        try {
            res.json(await GuesthousesService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching guesthouses" });
        }
    }
    async getOne(req, res) {
        try {
            const item = await GuesthousesService.getOne(req.params.id);
            if (!item) return res.status(404).json({ message: "Not found" });
            res.json(item);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching guesthouse" });
        }
    }
}

export default new GuesthousesController();
