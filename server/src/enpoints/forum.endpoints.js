import Router from "express";
import ForumController from "../controllers/forum.controller.js";

const router = new Router();
router.get("/", ForumController.getAll);
router.post("/", ForumController.create);
export default router;
