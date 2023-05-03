import asyncHandler from "express-async-handler";
import User from "../Models/UserModels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/Auth.js";

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, image, isAdmin, likedMovies } = req.body;
	try {
		const userExists = await User.findOne({ email });
		//  check if user exists
		if (userExists) {
			res.status(400);
			throw new Error("User already exists");
		}
		// esle create user
		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create user in DB
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			image,
			isAdmin,
		});
		// if user created success send user data and token to client
		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				image: user.image,
				isAdmin: user.isAdmin,
				token: generateToken(user._id),
			});
		} else {
			res.status(400);
			throw new Error("Invalid user data");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	try {
		// find user in DB
		const user = await User.findOne({ email });
		// if user exists compare password with hashed password then send user data and token to client
		if (user && (await bcrypt.compare(password, user.password))) {
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				image: user.image,
				isAdmin: user.isAdmin,
				token: generateToken(user._id),
			});
		}
		// if user not found or password not match send error message
		else {
			res.status(401);
			throw new Error("Invalid email or password");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// private controllers
// @desc update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const { name, email, image } = req.body;
	try {
		// find user in DB
		const user = await User.findById(req.user._id);
		// if user exists update user data and send user data and token to client
		if (user) {
			user.name = name || user.name;
			user.email = email || user.email;
			user.image = image || user.image;
			const updateUser = await user.save();
			// send updated user data and token to client
			res.json({
				_id: updateUser._id,
				name: updateUser.name,
				email: updateUser.email,
				image: updateUser.image,
				isAdmin: updateUser.isAdmin,
				token: generateToken(updateUser._id),
			});
		}
		// else send error message
		else {
			res.status(404);
			throw new Error("User not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	try {
		// find user in DB
		const user = await User.findById(req.params._id);
		// if user exists delete user
		if (user) {
			// if user is admin throw error message
			if (user.isAdmin) {
				res.status(400);
				throw new Error("Can not delete admin user");
			}
			// else delete user
			else {
				await user.deleteOne();
				res.json({ message: "User deleted" });
			}
			// else send error message
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc Change user password
// @route PUT /api/users/change-password
// @access Private
const changePassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	try {
		// find user in DB
		const user = await User.findById(req.user._id);
		// if user exists update user data and send user data and token to client
		if (user && (await bcrypt.compare(oldPassword, user.password))) {
			// hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);
			user.password = hashedPassword;
			await user.save();
			res.json({ message: "Password changed successfully" });
		}
		// else send error message
		else {
			res.status(404);
			throw new Error("Invalid old password");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc Get all liked movies
// @route GET /api/users/liked-movies
// @access Private
const getLikedMovies = asyncHandler(async (req, res) => {
	try {
		// find user in DB
		const user = await User.findById(req.user._id).populate("likedMovies");
		// if user exists send liked movies to client
		if (user) {
			res.json(user.likedMovies);
		}
		// else send error message
		else {
			res.status(404);
			throw new Error("User not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc add movie to liked movies
// @route PUT /api/users/liked-movies
// @access Private

const addLikedMovie = asyncHandler(async (req, res) => {
	const { movieId } = req.body;
	try {
		// find user in DB
		const user = await User.findById(req.user._id);
		// if user exists add movie to liked movies
		if (user) {
			// check if movie already liked
			if (user.likedMovies.includes(movieId)) {
				res.status(400);
				throw new Error("Movie already liked");
			}
			// else add movie to liked movies and saved
			user.likedMovies.push(movieId);
			await user.save();
			res.json(user.likedMovies);
		}
		// else send error message
		else {
			res.status(404);
			throw new Error("Movie not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc delete all liked movies
// @route DELETE /api/users/liked-movies
// @access Private
const deleteLikedMovies = asyncHandler(async (req, res) => {
	try {
		// find user in DB
		const user = await User.findById(req.user._id);
		// if user exists delete all liked movies
		if (user) {
			user.likedMovies = [];
			await user.save();
			res.json({ message: "Liked movies deleted" });
		}
		// else send error message
		else {
			res.status(404);
			throw new Error("User not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// ============================= ADMIN CONTROLLERS =======================
// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	try {
		// find all users in DB
		const users = await User.find({});
		// send users to client
		res.json(users);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc delete users
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUsers = asyncHandler(async (req, res) => {
	try {
		// find user in DB
		const user = await User.findById(req.params._id);
		// if user exists delete user
		if (user) {
			// if user is admin throw error message
			if (user.isAdmin) {
				res.status(400);
				throw new Error("Can not delete admin user");
			}
			// else delete user
			else {
				await user.remove();
				res.json({ message: "User deleted" });
			}
			// else send error message
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export {
	registerUser,
	loginUser,
	updateUserProfile,
	deleteUser,
	changePassword,
	getLikedMovies,
	addLikedMovie,
	deleteLikedMovies,
	getUsers,
	deleteUsers,
};
