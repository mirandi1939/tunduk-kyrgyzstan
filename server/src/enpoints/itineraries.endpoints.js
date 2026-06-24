import Router from "express";
import ItinerariesController from "../controllers/itineraries.controller.js";

const router = new Router();
router.get("/", ItinerariesController.getAll);
router.get("/:id", ItinerariesController.getOne);
export default router;
