import Cinema from "../Models/cinemaModels.js";
import asyncHandler from "express-async-handler";

// **************** ADMIN CONTROLLERS ****************
// @desc add new cinema
// @route POST /api/cinemas
// @access Private
const addCinema = asyncHandler(async (req, res) => {
	try {
		const { name, cinemaImage, address } = req.body;
		// create new cinema
		const cinema = new Cinema({
			name,
			cinemaImage,
			address,
		});
		// save     cinema
		const createdCinema = await cinema.save();
		res.status(201).json({ message: "Cinema created successfully", createdCinema });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc get all cinemas
// @route GET /api/cinemas
// @access Public
const getCinemas = asyncHandler(async (req, res) => {
	try {
		const cinemas = await Cinema.find({});
		res.json(cinemas);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc get cinema by id
// @route GET /api/cinemas/:id
// @access Public
const getCinemaById = asyncHandler(async (req, res) => {
	try {
		const cinema = await Cinema.findById(req.params.id);
		if (cinema) {
			res.json(cinema);
		} else {
			res.status(404).json({ message: "Cinema not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc update cinema
// @route PUT /api/cinemas/:id
// @access Private
const updateCinema = asyncHandler(async (req, res) => {
	try {
		const { name, cinemaImage, address } = req.body;
		const cinema = await Cinema.findById(req.params._id);
		if (cinema) {
			cinema.name = name || cinema.name;
			cinema.cinemaImage = cinemaImage || cinema.cinemaImage;
			cinema.address = address || cinema.address;
			const updatedCinema = await cinema.save();
			res.json({ message: "Cinema updated successfully", updatedCinema });
		} else {
			res.status(404).json({ message: "Cinema not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc delete cinema
// @route DELETE /api/cinemas/:id
// @access Private
const deleteCinema = asyncHandler(async (req, res) => {
	try {
		const cinema = await Cinema.findById(req.params._id);
		if (cinema) {
			await cinema.deleteOne();
			res.json({ message: "Cinema deleted successfully" });
		} else {
			res.status(404).json({ message: "Cinema not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// export
export { addCinema, getCinemas, getCinemaById, updateCinema, deleteCinema };
