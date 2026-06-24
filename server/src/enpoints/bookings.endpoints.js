import Router from "express";
import BookingsController from "../controllers/bookings.controller.js";

const router = new Router();
router.post("/", BookingsController.create);
export default router;
