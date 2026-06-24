import EmergencyService from "../services/emergency.service.js";

class EmergencyController {
    async getAll(req, res) {
        try {
            res.json(await EmergencyService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching emergency protocols" });
        }
    }
}

export default new EmergencyController();
