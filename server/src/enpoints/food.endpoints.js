import Router from "express";
import FoodController from "../controllers/food.controller.js";

const router = new Router();
router.get("/", FoodController.getAll);
export default router;
