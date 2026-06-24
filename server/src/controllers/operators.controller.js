import OperatorsService from "../services/operators.service.js";

class OperatorsController {
    async getAll(req, res) {
        try {
            res.json(await OperatorsService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching operators" });
        }
    }
    async getOne(req, res) {
        try {
            const item = await OperatorsService.getOne(req.params.id);
            if (!item) return res.status(404).json({ message: "Not found" });
            res.json(item);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching operator" });
        }
    }
}

export default new OperatorsController();
