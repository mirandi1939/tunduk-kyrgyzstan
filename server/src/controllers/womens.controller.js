import WomensService from "../services/womens.service.js";

class WomensController {
    async getAll(req, res) {
        try {
            res.json(await WomensService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching women's info" });
        }
    }
}

export default new WomensController();
