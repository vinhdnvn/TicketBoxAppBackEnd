import Booking from "../Models/BookingModels.js";
import asyncHandler from "express-async-handler";
import User from "../Models/UserModels.js";

// **************** ADMIN CONTROLLERS ****************
//  @desc delete booking from 1 user
//  @route DELETE /api/booking/:id
//  @access Private
const deleteBookingFromUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			// delete booking from user
			const booking = await Booking.findById(req.params._id);
			if (booking) {
				user.bookingInformation.pull(booking);
				await user.save();
				// delete booking from Booking
				await booking.remove();
				res.json({ message: "Booking removed" });
			} else {
				res.status(404).json({ message: "Booking not found" });
			}
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//  **************** USER CONTROLLERS ****************

// @desc add new booking reference to user _id
// @route POST /api/booking
// @access Public
const addBookingToUser = asyncHandler(async (req, res) => {
	try {
		// find user by id in database
		const user = await User.findById(req.user._id);
		if (user) {
			const booking = {
				movie: req.body.movie,
				cinema: req.body.cinema,
				date: req.body.date,
				time: req.body.time,
				seat: req.body.seat,
				price: req.body.price,
				gerne: req.body.gerne,
			};
			// push the new booking to the bookingInformation array
			user.bookingInformation.push(booking);
			// save the booking in datbase
			await user.save();
			res.status(201).json({ message: "Booking added" });
		} else {
			res.status(404);
			throw new Error("User not found");
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

// @desc get booking by id
// @route GET /api/booking/:id
// @access Public
const getBookingById = asyncHandler(async (req, res) => {
	try {
		const booking = await Booking.findById(req.params._id);
		if (booking) {
			res.json(booking);
		} else {
			res.status(404).json({ message: "Booking not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// export controllers
export { addBookingToUser, getBookingFromUser, getBookingById };
