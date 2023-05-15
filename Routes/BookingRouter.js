import express from "express";
import * as bookingController from "../Controllers/BookingController.js";
import { protect } from "../middlewares/Auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/:_id", bookingController.addBookingToUser);
router.get("/:_id", protect, bookingController.getBookingFromUser);
router.get("/:_id", bookingController.getBookingById);
export default router;
