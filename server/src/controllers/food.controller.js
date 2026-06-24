import FoodService from "../services/food.service.js";

class FoodController {
    async getAll(req, res) {
        try {
            res.json(await FoodService.getAll(req.query));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching food items" });
        }
    }
}

export default new FoodController();
