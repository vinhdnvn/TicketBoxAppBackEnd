import express from "express";
import * as cinemaController from "../Controllers/CinemaController.js";
import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", cinemaController.getCinemas);
router.get("/:_id", cinemaController.getCinemaById);

// ADMIN ROUTES
router.post("/", protect, admin, cinemaController.addCinema);
router.put("/:_id", protect, admin, cinemaController.updateCinema);
router.delete("/:_id", protect, admin, cinemaController.deleteCinema);

export default router;
