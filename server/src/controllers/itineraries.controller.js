import ItinerariesService from "../services/itineraries.service.js";

class ItinerariesController {
    async getAll(req, res) {
        try {
            res.json(await ItinerariesService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching itineraries" });
        }
    }
    async getOne(req, res) {
        try {
            const item = await ItinerariesService.getOne(req.params.id);
            if (!item) return res.status(404).json({ message: "Not found" });
            const days = await ItinerariesService.getDays(req.params.id);
            res.json({ ...item, days });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching itinerary" });
        }
    }
}

export default new ItinerariesController();
