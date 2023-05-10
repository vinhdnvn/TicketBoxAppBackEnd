import Booking from "../Models/BookingModels.js";
import asyncHandler from "express-async-handler";
import User from "../Models/UserModels.js";

// **************** ADMIN CONTROLLERS ****************

//  **************** USER CONTROLLERS ****************

// @desc add new booking reference to user _id
// @route POST /api/booking
// @access Public
const addBookingToUser = asyncHandler(async (req, res) => {
	try {
		const { movie, gerne, cinema, date, time, seat, price } = req.body;
		const user = await User.findById(req.user._id);
		if (user) {
			// create new booking
			const booking = new Booking({
				movie,
				gerne,
				cinema,
				date,
				time,
				seat,
				price,
			});
			// save booking
			user.bookingInformation.push(booking);
			const createdBooking = await user.save();
			// response booking and user id
			res.status(201).json({ message: "Booking created successfully", createdBooking });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc get all booking reference from user _id
// @route GET /api/booking
// @access Public
const getBookingFromUser = asyncHandler(async (req, res) => {
	try {
		// get all bookingInformation from User models
		const user = await User.findById(req.user._id);
		if (user) {
			res.status(200).json({ bookingInformation: user.bookingInformation });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// export controllers
export { addBookingToUser, getBookingFromUser };
