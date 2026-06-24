import Router from "express";
import PlacesController from "../controllers/places.controller.js";

const router = new Router();

// PUBLIC
router.get("/", PlacesController.getAllPlaces);
router.get("/:google_place_id", PlacesController.getOnePlace);
router.get("/:google_place_id/alternatives", PlacesController.getAlternatives);

export default router;
