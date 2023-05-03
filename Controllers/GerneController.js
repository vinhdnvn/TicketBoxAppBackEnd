import Gerne from "../Models/GerneModels.js";
import asyncHandler from "express-async-handler";

// *************PUBLIC CONTROLLERS*************
// @desc get all gernes
// @route GET /api/gernes
// @access Public
const getGernes = asyncHandler(async (req, res) => {
	try {
		// find all gernes in database
		const gernes = await Gerne.find({});
		res.status(200).json({ message: "Gernes found successfully", gernes });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// *************ADMIN CONTROLLERS*************
// @desc add new gerne
// @route POST /api/gernes
// @access Public

const createGerne = asyncHandler(async (req, res) => {
	try {
		//get gerne from request body
		const { title } = req.body;
		// create new gerne
		const gerne = new Gerne({
			title,
		});
		// save gerne in database
		const createdGerne = await gerne.save();
		res.status(201).json({ message: "Gerne created successfully", createdGerne });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc update gerne
// @route PUT /api/gernes/:_id
// @access Public
const updateGerne = asyncHandler(async (req, res) => {
	try {
		// get gerne id from request params
		const gerne = await Gerne.findById(req.params._id);
		// check if gerne exist
		if (gerne) {
			// update gerne
			gerne.title = req.body.title || gerne.title;
			// save gerne
			const updatedGerne = await gerne.save();
			// send the updated gerne to the client
			res.status(200).json({ message: "Gerne updated successfully", updatedGerne });
		} else {
			res.status(404);
			throw new Error("Gerne not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc delete gerne
// @route DELETE /api/gernes/:_id
// @access Private/Admin

const deleteGerne = asyncHandler(async (req, res) => {
	try {
		// get gerne id from request params
		const gerne = await Gerne.findById(req.params._id);
		// check if gerne exist
		if (gerne) {
			// delete gerne
			await gerne.deleteOne();
			// send message to the client
			res.status(200).json({ message: "Gerne deleted successfully" });
		} else {
			res.status(404);
			throw new Error("Gerne not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//  export all
export { getGernes, createGerne, updateGerne, deleteGerne };
