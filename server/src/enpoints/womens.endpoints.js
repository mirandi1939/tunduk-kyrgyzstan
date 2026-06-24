import Router from "express";
import WomensController from "../controllers/womens.controller.js";

const router = new Router();
router.get("/", WomensController.getAll);
export default router;
