import express from "express";
import * as gerneController from "../Controllers/GerneController.js";
import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", gerneController.getGernes);

// ADMIN ROUTES
router.post("/", protect, admin, gerneController.createGerne);
router.put("/:_id", protect, admin, gerneController.updateGerne);
router.delete("/:_id", protect, admin, gerneController.deleteGerne);

export default router;
