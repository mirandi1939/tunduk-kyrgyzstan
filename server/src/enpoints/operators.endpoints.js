import Router from "express";
import OperatorsController from "../controllers/operators.controller.js";

const router = new Router();
router.get("/", OperatorsController.getAll);
router.get("/:id", OperatorsController.getOne);
export default router;
