import express from "express";
import {
	registerUser,
	loginUser,
	updateUserProfile,
	deleteUser,
	changePassword,
	getLikedMovies,
	addLikedMovie,
	getUsers,
	deleteLikedMovies,
	getUserById,
} from "../Controllers/UserController.js";
import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();
// PUBLIC ROUTES
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/:_id", getUserById);
// PRIVATE ROUTES
router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUser);
router.put("/password", protect, changePassword);
router.get("/favourites", protect, getLikedMovies);
router.post("/favourites", protect, addLikedMovie);
router.delete("/favourites", protect, deleteLikedMovies);
// ADMIN ROUTES
router.get("/", protect, admin, getUsers);
router.delete("/:_id", protect, admin, deleteUser);

export default router;
