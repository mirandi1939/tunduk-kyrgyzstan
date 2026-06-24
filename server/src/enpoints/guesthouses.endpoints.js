import Router from "express";
import GuesthousesController from "../controllers/guesthouses.controller.js";

const router = new Router();
router.get("/", GuesthousesController.getAll);
router.get("/:id", GuesthousesController.getOne);
export default router;
