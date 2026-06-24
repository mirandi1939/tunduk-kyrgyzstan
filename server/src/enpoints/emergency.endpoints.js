import Router from "express";
import EmergencyController from "../controllers/emergency.controller.js";

const router = new Router();
router.get("/", EmergencyController.getAll);
export default router;
