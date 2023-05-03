import express from "express";
import * as moviesController from "../Controllers/MoviesController.js";
import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", moviesController.getMovies);
router.get("/:_id", moviesController.getMovieById);
router.get("/rated/top", moviesController.getTopRatedMovies);
router.get("/random/all", moviesController.getRandomMovies);

// ADMIN ROUTES
router.post("/", protect, admin, moviesController.addMovies);
router.put("/:_id", protect, admin, moviesController.updateMovie);
router.delete("/:_id", protect, admin, moviesController.deleteMovie);
// PRIVATE ROUTES
router.post("/:_id/reviews", protect, moviesController.createMovieReview);

export default router;
